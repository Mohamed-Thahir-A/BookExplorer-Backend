"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
console.log('🔧 Supabase Configuration:');
console.log('URL:', supabaseUrl ? '✓ Loaded' : '✗ Missing');
console.log('Key:', supabaseKey ? '✓ Loaded' : '✗ Missing');
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
console.log('✅ Supabase client created successfully');
//# sourceMappingURL=supabase.config.js.map