import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import os from 'os';

export async function POST(req: NextRequest) {
  let tempFilePath = '';

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const tempDir = os.tmpdir();
    tempFilePath = path.join(tempDir, `upload-${Date.now()}-${file.name}`);
    
    await writeFile(tempFilePath, buffer);

    const scriptDir = path.resolve(process.cwd(), 'plant_disease'); 
    const pythonScriptPath = path.join(scriptDir, 'run_prediction.py');

    // WRAPPER: Await the python script execution here
    // This fixes the "Promise<unknown>" TypeScript error
    const pythonResult = await new Promise<{ success: boolean; data?: string; error?: string }>((resolve) => {
      // KEEP YOUR CORRECT PYTHON PATH HERE
      const pythonExecutable = '/home/nischal-sharma/anaconda3/envs/agriculture/bin/python3';
      
      const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, tempFilePath], {
        cwd: scriptDir 
      });

      let result = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          const finalErrorMessage = errorOutput || result || 'Unknown error occurred';
          console.error('---------------- PYTHON FAILURE ----------------');
          console.error('Exit Code:', code);
          console.error('Error Output:', errorOutput);
          console.error('------------------------------------------------');
          
          resolve({ success: false, error: finalErrorMessage });
        } else {
          resolve({ success: true, data: result.trim() });
        }
      });
    });

    // Cleanup file
    try {
      if (tempFilePath) await unlink(tempFilePath);
    } catch (e) {
      console.error('Failed to cleanup temp file:', e);
    }

    // FINAL RETURN: Now we return a clear NextResponse based on the awaited result
    if (!pythonResult.success) {
      return NextResponse.json(
        { error: 'Prediction failed', details: pythonResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ prediction: pythonResult.data });

  } catch (error: any) {
    // Cleanup file in case of crash
    try {
      if (tempFilePath) await unlink(tempFilePath);
    } catch (cleanupError) { /* ignore */ }

    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}