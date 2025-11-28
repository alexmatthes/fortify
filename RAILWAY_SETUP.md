# Railway Deployment Configuration for Canvas Package

The `canvas` npm package requires system dependencies to build from source on Node.js 22. Since Railway uses Railpack, you need to configure it to install these packages.

## Solution: Set Environment Variables in Railway Dashboard

1. **Go to your Railway project dashboard**
2. **Navigate to your backend service**
3. **Go to the "Variables" tab**
4. **Add the following environment variable:**

   **Variable Name:** `RAILPACK_BUILD_APT_PACKAGES`
   
   **Variable Value:**
   ```
   build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev libpixman-1-dev pkg-config python3
   ```

5. **Save the variable and trigger a new deployment**

## Alternative: Configuration Files

We've also created configuration files in multiple formats:
- `backend/nixpacks.toml` - Nixpacks format
- `backend/railway.toml` - Railway TOML format  
- `backend/railway.json` - Railway JSON format
- `nixpacks.toml` - Root directory Nixpacks format

If Railway detects these files, they should work. However, the environment variable method is the most reliable.

## Why This Is Needed

The `canvas` package version 2.11.2 doesn't have pre-built binaries for Node.js 22.21.1, so it needs to build from source. Building from source requires these system libraries:
- `libpixman-1-dev` - Pixel manipulation (the missing one causing the error)
- `libcairo2-dev` - Graphics rendering
- `libpango1.0-dev` - Text layout
- `build-essential` - Compilation tools
- Other supporting libraries

