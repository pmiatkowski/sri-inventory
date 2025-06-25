# SRI Inventory

A TypeScript utility for generating Subresource Integrity (SRI) hashes and script inventories to enhance web application security and maintain PCI DSS 6.4.3 compliance.

## Overview

SRI Inventory is a comprehensive security tool that helps web developers maintain secure applications by:

- **Generating SRI hashes** for local scripts and stylesheets in HTML files
- **Creating detailed script inventories** of all JavaScript files in your application
- **Ensuring PCI DSS 6.4.3 compliance** by tracking and documenting all scripts
- **Automating security processes** to prevent unauthorized script execution

## Features

### 🔐 Subresource Integrity (SRI) Hash Generation

Automatically adds integrity attributes to `<script>` and `<link>` elements in your HTML files, protecting against:

- Compromised CDNs
- Man-in-the-middle attacks
- Unauthorized script modifications

### 📋 Script Inventory Generation

Creates a comprehensive JSON inventory of all scripts in your application, including:

- Local application scripts with SHA-384 hashes
- External scripts and their sources
- Predefined scripts that may be dynamically loaded
- Categorization and reasoning for each script

### 🛡️ PCI DSS 6.4.3 Compliance

Helps maintain compliance with PCI DSS requirement 6.4.3 by providing:

- Complete documentation of all scripts
- Hash verification for integrity checking
- Automated inventory management

## Usage

### Basic Usage

Run the tool on your build output directory:

```bash
npm start -- --target=./dist
```

This will:

1. Generate a script inventory (`scripts-inventory.json`)
2. Add SRI hashes to your HTML files

### Command Line Options

- `--target`: Specify the target directory containing your built application (default: `./dist`)

### Programmatic Usage

```typescript
import { inventoryGenerator, sriHashes } from 'sri-inventory';

// Generate script inventory
await inventoryGenerator();

// Add SRI hashes to HTML files
await sriHashes('index.html', 'other.html');
```

## Configuration

### Predefined Scripts

You can configure predefined scripts that should be included in the inventory even if they're not found in the build output. Edit the `PREDEFINED_SCRIPTS` array in `inventory-generator.ts`:

```typescript
const PREDEFINED_SCRIPTS: ScriptInventory[] = [
    {
        name: 'https://google.maps.com/some-script.js',
        type: 'external',
        hash: null,
        reason: 'External script - Google Maps integration'
    },
    {
        name: 'analytics.js',
        type: 'local',
        hash: null,
        reason: 'Analytics tracking script'
    }
];
```

### Script Categorization

The tool automatically categorizes scripts based on naming patterns:

- `main`: Main application bundle
- `runtime`: Runtime code
- `polyfills`: Browser polyfills
- `vendor`: Third-party dependencies
- `styles`: Application styles
- `chunk`: Lazy loaded module chunks
- `common`: Shared module chunks

## Output

### Script Inventory (`scripts-inventory.json`)

```json
[
  {
    "name": "https://google.maps.com/some-script.js",
    "type": "external",
    "hash": null,
    "reason": "External script - some-script.js"
  },
  {
    "name": "main.js",
    "type": "local",
    "hash": "sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC",
    "reason": "Main application bundle"
  },
  {
    "name": "runtime.js",
    "type": "local",
    "hash": "sha384-BvE3lj0j7QlT8UiEnM7x5UnhU8JYWNxYmb5LhYzSgJvmgC8Kg7c6eFG3RQbO8K7F",
    "reason": "Runtime"
  }
]
```

### HTML with SRI Hashes

Before:

```html
<script src="./main.js"></script>
<link rel="stylesheet" href="./styles.css">
```

After:

```html
<script src="./main.js" integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"></script>
<link rel="stylesheet" href="./styles.css" integrity="sha384-BvE3lj0j7QlT8UiEnM7x5UnhU8JYWNxYmb5LhYzSgJvmgC8Kg7c6eFG3RQbO8K7F">
```

## Examples

### Example 1: Basic Angular/React Build

```bash
# Build your application
npm run build

# Generate SRI hashes and inventory
npx sri-inventory --target=./dist
```

### Example 2: Custom Build Directory

```bash
# For applications with custom build output
npx sri-inventory --target=./build
```

### Example 3: Multiple HTML Files

```typescript
import { sriHashes } from 'sri-inventory';

// Process multiple HTML files
await sriHashes('index.html', 'admin.html', 'login.html');
```

### Example 4: Integration with Build Process

Add to your `package.json`:

```json
{
  "scripts": {
    "build": "ng build",
    "build:secure": "npm run build && npx sri-inventory --target=./dist",
    "postbuild": "npx sri-inventory --target=./dist"
  }
}
```

## Security Benefits

### Protection Against

- **CDN Compromise**: SRI hashes ensure external resources haven't been tampered with
- **Supply Chain Attacks**: Inventory tracking helps identify unauthorized scripts
- **Code Injection**: Integrity checks prevent execution of modified scripts
- **Compliance Violations**: Automated documentation helps maintain PCI DSS 6.4.3 compliance

### Best Practices

1. **Regular Updates**: Run the tool after every build to maintain current hashes
2. **Version Control**: Commit the script inventory to track changes over time
3. **Monitoring**: Review inventory changes during code reviews
4. **Automation**: Integrate into CI/CD pipelines for consistent security

## Requirements

- Node.js >= 16.0.0
- TypeScript support
- Build output directory with HTML files

## Development

```bash
# Clone the repository
git clone https://github.com/pmiatkowski/sri-inventory.git

# Install dependencies
npm install

# Run development version
npm run start -- --target=./example-dist
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

Pawel Miatkowski

- GitHub: [@pmiatkowski](https://github.com/pmiatkowski)
- Repository: [sri-inventory](https://github.com/pmiatkowski/sri-inventory)

## Support

For questions, issues, or feature requests, please visit the [GitHub Issues](https://github.com/pmiatkowski/sri-inventory/issues) page.
