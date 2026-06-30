# Netlify Deployment Instructions

## Steps to Deploy on Netlify

### Method 1: Drag and Drop
1. Zip all files in the project folder
2. Go to [Netlify](https://netlify.com)
3. Drag and drop the zip file to the deploy area
4. Your site will be live in seconds!

### Method 2: Git Integration
1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Set build settings:
   - Build command: (leave empty)
   - Publish directory: (leave empty or set to ".")
4. Deploy!

## Important Files for Netlify

- `index.html` - Main entry point
- `_redirects` - Handles routing
- `netlify.toml` - Configuration file
- `package.json` - Project metadata

## Features That Work on Netlify

✅ Static file serving  
✅ Client-side routing  
✅ Local Storage (cart, authentication)  
✅ JavaScript functionality  
✅ CSS styling  
✅ Image assets  
✅ Blog pages  

## Notes

- No server-side code required
- All functionality is client-side
- Works with Netlify's free tier
- Automatic HTTPS
- Global CDN

## Troubleshooting

If you encounter issues:
1. Check browser console for errors
2. Ensure all file paths are relative
3. Verify all assets are uploaded
4. Check Netlify build logs
