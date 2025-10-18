#!/bin/bash

echo "🚗 Setting up Toyota Financial Navigator..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create environment file
echo "🔧 Creating environment configuration..."
cat > .env.local << EOF
# Toyota Financial Navigator Environment Variables
NEXT_PUBLIC_APP_NAME="Toyota Financial Navigator"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_APP_DESCRIPTION="AI-powered financial wellness platform for personalized Toyota vehicle financing"
EOF

echo "✅ Environment file created!"

echo ""
echo "🎉 Setup complete! Toyota Financial Navigator is ready to go!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To build for production:"
echo "  npm run build"
echo "  npm start"
echo ""
echo "Visit http://localhost:3000 to see the application"
echo ""
echo "🚀 Happy coding!"
