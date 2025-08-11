# 🚀 Frontend Deployment Guide - Vercel

## **Prerequisites**
- GitHub account
- Vercel account (free)

## **Step 1: Prepare Your Code**

### **1.1 Environment Variables (Already Done)**
✅ Updated API service to use environment variables
✅ Created TypeScript definitions for environment variables

### **1.2 Commit and Push to GitHub**
```bash
git add .
git commit -m "Prepare frontend for Vercel deployment with environment variables"
git push origin main
```

## **Step 2: Deploy on Vercel**

### **2.1 Create Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub
4. Verify your email

### **2.2 Deploy Your Project**
1. **Click "New Project"**
2. **Import Git Repository**
3. **Select your frontend repository** (todo-app)
4. **Configure Project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
5. **Click "Deploy"**

### **2.3 Set Environment Variables**
In your Vercel project dashboard:

1. **Go to Settings → Environment Variables**
2. **Add the following variables:**

```
VITE_API_BASE_URL=https://your-backend-name.onrender.com/api
VITE_APP_NAME=Todo App
VITE_APP_VERSION=1.0.0
```

**Replace `your-backend-name` with your actual Render backend URL**

## **Step 3: Update Backend CORS**

### **3.1 Update Backend CORS Settings**
In your Render backend dashboard:

1. **Go to Environment Variables**
2. **Add/Update:**
```
CORS_ORIGIN=https://your-frontend-name.vercel.app
```

**Replace `your-frontend-name` with your actual Vercel frontend URL**

## **Step 4: Test Deployment**

### **4.1 Test Frontend**
1. **Visit your Vercel URL**
2. **Test registration/login**
3. **Test CRUD operations**
4. **Test mobile responsiveness**

### **4.2 Test API Connection**
```bash
# Test health check
curl https://your-backend-name.onrender.com/health

# Test API endpoint
curl https://your-backend-name.onrender.com/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
```

## **🚨 Important Notes**

### **Environment Variables**
- **VITE_API_BASE_URL**: Your Render backend URL + `/api`
- **CORS_ORIGIN**: Your Vercel frontend URL
- **All VITE_ variables**: Must be prefixed with `VITE_` for Vite

### **URL Structure**
```
Frontend: https://your-app-name.vercel.app
Backend:  https://your-backend-name.onrender.com
API:      https://your-backend-name.onrender.com/api
```

### **Common Issues**
- **CORS errors**: Check CORS_ORIGIN in backend
- **API not found**: Verify VITE_API_BASE_URL
- **Build errors**: Check Vercel build logs
- **Cold starts**: First request takes 3-12 seconds

## **🎯 Deployment URLs**

### **Your URLs will be:**
```
Frontend: https://todo-app-[random].vercel.app
Backend:  https://todo-backend-[random].onrender.com
```

### **Example:**
```
Frontend: https://todo-app-abc123.vercel.app
Backend:  https://todo-backend-xyz789.onrender.com
API:      https://todo-backend-xyz789.onrender.com/api
```

## **📱 Mobile Testing**
1. **Open your Vercel URL on mobile**
2. **Test responsive design**
3. **Test touch interactions**
4. **Test filter modal**
5. **Test sidebar navigation**

## **🔧 Troubleshooting**

### **If Frontend Can't Connect to Backend:**
1. **Check VITE_API_BASE_URL** in Vercel environment variables
2. **Check CORS_ORIGIN** in Render environment variables
3. **Verify backend is running** on Render
4. **Check browser console** for errors

### **If Build Fails:**
1. **Check Vercel build logs**
2. **Verify all dependencies** are in package.json
3. **Check TypeScript errors**
4. **Verify Vite configuration**

## **🎉 Success!**
Once deployed, you'll have:
- ✅ **Frontend**: Vercel (React + Vite)
- ✅ **Backend**: Render (Node.js + Express)
- ✅ **Database**: Render PostgreSQL
- ✅ **100% Free**: No credit card required

## **📞 Support**
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Render Documentation: [docs.render.com](https://docs.render.com)
- Vite Documentation: [vitejs.dev](https://vitejs.dev)
