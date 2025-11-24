import sys
import os
# CRITICAL FIX: Import ResNet9 so the saved model can find the class definition in __main__
from disease import predict_single_image, ResNet9 

def main():
    if len(sys.argv) < 2:
        print("Error: No image file path provided")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    # Assuming model is located relative to this script
    model_path = os.path.join(os.path.dirname(__file__), 'plant-disease-model-complete.pth')

    if not os.path.exists(image_path):
        print(f"Error: Image file does not exist at {image_path}")
        sys.exit(1)
    
    if not os.path.exists(model_path):
        print(f"Error: Model file does not exist at {model_path}")
        sys.exit(1)
    
    try:
        # Pass the model path to the prediction function
        prediction = predict_single_image(image_path, model_path)
        print(prediction)
        sys.exit(0)
    except Exception as e:
        # Use simple print so the Node.js script captures it in 'result' or 'errorOutput'
        print(f"Error running prediction: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()