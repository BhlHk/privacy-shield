// src/utils/patterns.ts

export const PATTERNS: Record<string, RegExp> = {
    // --- PII (PERSONAL INFO) ---
    email: /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g,
    
    // IPv4 (e.g., 192.168.1.1)
    ipv4: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    
    // IPv6 (Complex standard format)
    ipv6: /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6}))/g,
  
    // Credit Cards (Visa, Mastercard, Amex, Discover - ignoring separators)
    credit_card: /\b(?:\d[ -]*?){13,16}\b/g,
    
    // US Social Security Number
    ssn_us: /\b\d{3}-\d{2}-\d{4}\b/g,
    
    // Phone Numbers (International E.164 or US standard)
    // Catches: +1-555-555-5555 or (555) 555-5555
    phone: /(\+|00)[1-9][0-9 \-\(\)\.]{7,32}/g,
  
    // --- CLOUD PROVIDERS ---
    
    // AWS Access Key ID (AKIA, ASIA, ABIA...)
    aws_id: /\b((?:AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16})\b/g,
    
    // Google API Key (AIza...)
    google_api: /AIza[0-9A-Za-z\\-_]{35}/g,
    
    // Google OAuth Access Token
    google_oauth: /ya29\.[0-9A-Za-z\\-_]+/g,
    
    // Heroku API Key
    heroku_key: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g,
    
    // Firebase Cloud Messaging (FCM)
    firebase_fcm: /AAAA[a-zA-Z0-9_-]{7}:[a-zA-Z0-9_-]{140}/g,
  
    // --- DEV TOOLS & SaaS ---
    
    // GitHub Personal Access Token (classic & new format)
    github_token: /(gh[pousr]_[a-zA-Z0-9]{36,})/g,
    
    // Slack Token (Bot, User, Signing)
    slack_token: /(xox[baprs]-([a-zA-Z0-9-]{10,}))/g,
    
    // Stripe Secret Key (Live & Test)
    stripe_key: /(sk_live_[0-9a-zA-Z]{24,}|sk_test_[0-9a-zA-Z]{24,})/g,
    
    // OpenAI API Key (sk-...)
    openai_key: /sk-[a-zA-Z0-9]{48}/g,
    
    // NPM Access Token
    npm_token: /npm_[a-zA-Z0-9]{36}/g,
  
    // --- INFRASTRUCTURE & CRYPTO ---
    
    // Private Keys (RSA, DSA, EC, PGP) - Catches the Header/Footer block
    private_key: /-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----/g,
    
    // JSON Web Token (JWT) - Looks for 3 parts separated by dots
    // We check for the "eyJ" header common in JWTs
    jwt: /eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g,
    
    // Database Connection Strings (URI with password)
    // e.g. postgres://user:password@localhost
    db_uri: /(?:postgres|mysql|mongodb|redis|oracle|mssql):\/\/[a-zA-Z0-9_]+:([a-zA-Z0-9_%\-@!#^&*]+)@/g,
    
    // Bitcoin Wallet Address
    crypto_btc: /\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b/g,
    
    // Ethereum Wallet Address
    crypto_eth: /\b0x[a-fA-F0-9]{40}\b/g,
    
    // Generic High-Entropy Hex Strings (32+ chars)
    // Catches things like MD5 hashes or generic API keys we missed
    generic_hex: /\b[a-fA-F0-9]{32,}\b/g,
  };