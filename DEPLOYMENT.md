# Netlify Deployment Instructions

## Prerequisites
1. Anthropic API key from [console.anthropic.com](https://console.anthropic.com)
2. GitHub repository with this code
3. Netlify account linked to your GitHub

## Deployment Steps

### 1. GitHub Setup
```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/tabletop-writer.git
git branch -M main
git push -u origin main
```

### 2. Netlify Deployment
1. Log into [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub" 
4. Select your `tabletop-writer` repository
5. Configure build settings:
   - **Build command**: Leave empty (or `echo "Static site"`)
   - **Publish directory**: `.` (root directory)
6. Click "Deploy site"

### 3. Environment Variables
1. In your Netlify dashboard, go to **Site settings** → **Environment variables**
2. Add a new variable:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: Your Anthropic API key (starts with `sk-ant-`)
   - **Scopes**: Select "Functions"

### 4. Custom Domain (Optional)
1. Go to **Site settings** → **Domain management**
2. Add your custom domain
3. Netlify will handle SSL certificates automatically

## Local Development
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Clone your repo
git clone https://github.com/YOUR_USERNAME/tabletop-writer.git
cd tabletop-writer

# Create .env file for local development
echo "ANTHROPIC_API_KEY=your_api_key_here" > .env

# Start local development server
netlify dev
```

## API Usage Notes
- Uses Claude 3 Haiku for cost-effective generation
- Rate limiting handled by Anthropic
- Responses cached locally for user experience
- Error handling for API failures

## Security Features
- API key never exposed to frontend
- CORS properly configured
- Security headers in netlify.toml
- Input validation on all form data