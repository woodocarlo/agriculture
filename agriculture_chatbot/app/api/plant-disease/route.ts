import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import os from 'os';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `upload-${Date.now()}-${file.name}`);
    
    await writeFile(tempFilePath, buffer);

    const scriptDir = path.resolve(process.cwd(), 'plant_disease'); 
    const pythonScriptPath = path.join(scriptDir, 'run_prediction.py');

    return new Promise((resolve) => {
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

      pythonProcess.on('close', async (code) => {
        try {
          await unlink(tempFilePath);
        } catch (e) {
          console.error('Failed to cleanup temp file:', e);
        }

        // --- CHANGED SECTION STARTS HERE ---
        if (code !== 0) {
          // Since your python script uses print() for errors, 
          // the error message might be in 'result', not 'errorOutput'.
          const finalErrorMessage = errorOutput || result || 'Unknown error occurred';

          console.error('---------------- PYTHON FAILURE ----------------');
          console.error('Exit Code:', code);
          console.error('Error Output (stderr):', errorOutput);
          console.error('Standard Output (stdout):', result);
          console.error('------------------------------------------------');
          
          resolve(
            NextResponse.json(
              { error: 'Prediction failed', details: finalErrorMessage },
              { status: 500 }
            )
          );
          return;
        }
        // --- CHANGED SECTION ENDS HERE ---

        const prediction = result.trim();
        resolve(NextResponse.json({ prediction }));
      });
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}