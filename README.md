# Temporal Trust Engine

An AI-powered fraud detection dashboard for e-commerce platforms, featuring advanced analytics, real-time monitoring, and agentic workflows for automated fraud prevention.

## 🚀 Features

### Core Fraud Detection
- **Accurate RRDI Calculation**: Review-Return Discrepancy Index with precise statistical implementation
- **Advanced Trust Scoring**: Bayesian smoothing and burst detection integration
- **Real-time Analytics**: Live dashboard with comprehensive fraud metrics
- **Multi-signal Detection**: Combines review patterns, return rates, and GNN signals

### Agentic Workflow
- **Automated Fraud Blocking**: AI agent that proactively blocks suspicious products
- **Manual Override**: Human-in-the-loop controls for blocking/unblocking products
- **Real-time Notifications**: Toast alerts for agent actions and system events

### Analytics & Visualization
- **Interactive Charts**: Category distribution, risk levels, fraud trends
- **Network Graphs**: Product relationship visualization
- **Key Metrics**: Fraud rate, total units sold, average reviews, return rates
- **Filtering System**: View all, flagged, or trusted products

## 🏗️ Architecture

### Frontend
- **Next.js 15.2.4** with React 19
- **TypeScript** for type safety
- **Tailwind CSS** with custom design system
- **Recharts** for data visualization
- **Radix UI** components with custom styling

### Backend Logic
- **Centralized Data Layer**: In-memory database with proper data structures
- **Fraud Detection Engine**: Statistically sound RRDI and Trust Score calculations
- **API Endpoints**: RESTful APIs for agent actions and data management

### System Design
- **GNN Integration**: Graph Neural Network signals for advanced fraud detection
- **Agentic Workflow**: Automated decision-making with human oversight
- **Real-time Processing**: Live data updates and immediate action execution

## 📊 Fraud Detection Logic

### RRDI (Review-Return Discrepancy Index)
```
RRDI = | (Positive Reviews / Total Reviews) - (Successful Deliveries / Total Orders) |
```

### Trust Score
```
Trust Score = (Bayesian Score / 5) * 100 * (1 - Risk Factor)
Risk Factor = 0.7 * RRDI + 0.3 * Burst Score
```

### Fraud Detection Rules
- **High Risk**: RRDI > 0.45
- **Medium Risk**: RRDI > 0.3 AND Burst Score > 0.5
- **GNN Signal**: GNN Fraud Signal AND RRDI > 0.2

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Quick Start
```bash
# Clone the repository
git clone <your-repo-url>
cd temporal-trust-engine

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🎯 Usage

### Dashboard
1. **View Overview**: See total, flagged, and trusted product counts
2. **Run Agent**: Click "Run Fraud Check Agent" to trigger automated fraud detection
3. **Filter Products**: Use the filter buttons to view specific product categories
4. **Analyze Charts**: Explore fraud trends and category distributions

### Product Analysis
1. **Click Product Card**: Navigate to detailed analysis for any product
2. **Review Metrics**: Examine RRDI, Trust Score, and other key indicators
3. **Take Action**: Manually block or unblock products using the Agent Actions panel
4. **View Network**: Explore product relationships in the network graph

### Agent Workflow
1. **Automatic Detection**: Agent runs periodically to identify suspicious products
2. **GNN Signals**: Graph Neural Network provides additional fraud signals
3. **Blocking Logic**: Products with strong fraud indicators are automatically blocked
4. **Manual Override**: Human operators can override agent decisions

## 🔧 API Endpoints

### Agent Management
- `GET /api/agent/run` - Trigger fraud detection agent
- `POST /api/action/block` - Manually block/unblock a product

### Data Access
- `GET /api/products` - Get all products (via lib/db.ts)
- `GET /api/products/[asin]` - Get specific product details

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── agent/run/     # Agent workflow endpoint
│   │   └── action/block/  # Manual blocking endpoint
│   ├── analysis/[asin]/   # Product analysis pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard page
├── components/            # React components
│   ├── dashboard-charts.tsx
│   ├── product-card.tsx
│   ├── stats-overview.tsx
│   └── ui/               # Reusable UI components
├── lib/                  # Core business logic
│   ├── fraud-logic.ts    # Fraud detection algorithms
│   ├── db.ts            # Data management
│   └── utils.ts         # Utility functions
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## 🎨 Design System

### Color Palette
- **Primary**: `#ff6b6b` (Coral Red)
- **Background**: `#0a0e1a` (Deep Navy)
- **Success**: `#10b981` (Emerald Green)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)

### Components
- **Glass Morphism**: Backdrop blur effects with transparency
- **Gradient Overlays**: Sophisticated color transitions
- **Animated Elements**: Smooth transitions and hover effects
- **Responsive Design**: Mobile-first approach

## 🔮 Future Enhancements

- **Real Database**: PostgreSQL with proper data persistence
- **Machine Learning**: TensorFlow.js integration for client-side ML
- **Real-time Updates**: WebSocket connections for live data
- **Advanced Analytics**: More sophisticated fraud detection algorithms
- **Multi-tenant Support**: Support for multiple e-commerce platforms
- **Audit Logging**: Comprehensive action tracking and history

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue in the GitHub repository. 