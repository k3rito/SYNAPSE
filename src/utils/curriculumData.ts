export type Lesson = {
  id: string;
  title: string;
  description: string;
};

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';

export type Topic = {
  id: string;
  title: string;
  description: string;
  difficulties: Record<DifficultyLevel, Lesson[]>;
};

export type Track = {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
};

export const curriculumData: Record<string, Track> = {
  'network-architecture': {
    id: 'network-architecture',
    title: 'Network Architecture',
    description: 'Master enterprise-grade networking from physical layer to global BGP mesh.',
    topics: [
      {
        id: 'phase-0-mindset',
        title: 'Phase 0: Networking Mindset',
        description: 'Understanding networks beyond usage, LAN/WAN/Internet. Network = Devices + Protocols + Data.',
        difficulties: {
          'Beginner': [
            { id: 'network-intro', title: 'The Global Nervous System', description: 'What is a network really?' },
            { id: 'lan-wan-internet', title: 'LAN, WAN & The Web', description: 'Geographical network scales.' }
          ],
          'Intermediate': [],
          'Advanced': [],
          'Pro': []
        }
      },
      {
        id: 'phase-1-fundamentals',
        title: 'Phase 1: Fundamentals (OSI Model)',
        description: 'OSI Model Layers, TCP/IP architecture, IP Addresses, Subnet, Gateway, DNS.',
        difficulties: {
          'Beginner': [
            { id: 'osi-model', title: 'The 7 Layers of OSI', description: 'Physical to Application deep dive.' },
            { id: 'tcp-ip-stack', title: 'TCP/IP Architecture', description: 'The practical stack of the internet.' }
          ],
          'Intermediate': [
            { id: 'ipv4-subnetting', title: 'IP & Subnetting Basics', description: 'Logical addressing fundamentals.' }
          ],
          'Advanced': [],
          'Pro': []
        }
      },
      {
        id: 'phase-2-protocols',
        title: 'Phase 2: Network Protocols',
        description: 'HTTP/HTTPS, FTP, SSH, DHCP, DNS. Tools: Wireshark, Ping, Traceroute.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [
            { id: 'application-protocols', title: 'Application Layer Language', description: 'HTTP, FTP, and SSH.' },
            { id: 'wireshark-basics', title: 'Wireshark Sniffing', description: 'Capturing your first packets.' }
          ],
          'Advanced': [],
          'Pro': []
        }
      },
      {
        id: 'phase-3-hands-on',
        title: 'Phase 3: Hands-on Application',
        description: 'Practical setup of LAN, device connection, Router configuration. Tools: Cisco Packet Tracer, GNS3.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [
            { id: 'packet-tracer-lan', title: 'Building a Virtual LAN', description: 'Using Cisco Packet Tracer.' }
          ],
          'Advanced': [
            { id: 'router-config-cli', title: 'Router CLI Mastery', description: 'Configuring Cisco IOS device.' }
          ],
          'Pro': []
        }
      },
      {
        id: 'phase-4-intermediate-deep-dive',
        title: 'Phase 4: Intermediate Deep Dive',
        description: 'Subnetting (CIDR), Routing (Static, Dynamic - RIP, OSPF), Switching (VLAN, MAC Address Tables).',
        difficulties: {
          'Beginner': [],
          'Intermediate': [],
          'Advanced': [
            { id: 'cidr-calculations', title: 'Variable Length Subnet Masking', description: 'Optimizing IP space.' },
            { id: 'vlan-trunking', title: 'VLAN & Trunking', description: 'Segregating Layer 2 traffic.' },
            { id: 'ospf-routing', title: 'OSPF Dynamic Routing', description: 'Multi-area interior gateway protocols.' }
          ],
          'Pro': []
        }
      },
      {
        id: 'phase-5-advanced-networking',
        title: 'Phase 5: Advanced Networking',
        description: 'NAT, VPN, Firewall, Load Balancing. Tools: pfSense, OpenVPN.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [],
          'Advanced': [],
          'Pro': [
            { id: 'nat-vpn-tunnels', title: 'NAT & Site-to-Site VPN', description: 'Secure tunneling and translation.' },
            { id: 'load-balancing-bgp', title: 'BGP path vectoring', description: 'Global internet scale routing.' }
          ]
        }
      },
      {
        id: 'phase-6-network-security',
        title: 'Phase 6: Network Security',
        description: 'Sniffing, MITM attacks, Firewall Rules, IDS/IPS. Tools: Nmap, Kali Linux.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [],
          'Advanced': [],
          'Pro': [
            { id: 'nmap-enumeration', title: 'Advanced Nmap Scanning', description: 'Bypassing firewalls.' },
            { id: 'ids-ips-setup', title: 'Intrusion Detection Systems', description: 'Configuring Suricata/Snort.' }
          ]
        }
      }
    ]
  },
  'full-stack-engineering': {
    id: 'full-stack-engineering',
    title: 'Full-Stack Engineering',
    description: 'Master the complete web architecture from UI/UX to scalable backend systems.',
    topics: [
      {
        id: 'mindset-architecture',
        title: 'Phase 0: The Engineering Mindset',
        description: 'Understanding System Design before Code: Client/Server, Req/Res, Data Persistence.',
        difficulties: {
          'Beginner': [
            { id: 'system-design-intro', title: 'System Design 101', description: 'Thinking in systems, not just code.' },
            { id: 'request-response', title: 'The Request/Response Cycle', description: 'What happens when you click a button?' }
          ],
          'Intermediate': [
            { id: 'stateless-stateful', title: 'Stateless vs Stateful', description: 'Managing application data flow.' }
          ],
          'Advanced': [],
          'Pro': []
        }
      },
      {
        id: 'frontend-mastery',
        title: 'Phase 1: Frontend Dominance',
        description: 'Mastering the trinity: HTML, CSS, JavaScript and modern React framework.',
        difficulties: {
          'Beginner': [
            { id: 'html-css3', title: 'Modern HTML5 & CSS3', description: 'Semantic structure and advanced design.' },
            { id: 'js-logic', title: 'JavaScript Fundamentals', description: 'The engine of the web.' }
          ],
          'Intermediate': [
            { id: 'react-core', title: 'React Deep Dive', description: 'Hooks, State, Props, and Lifecycle.' }
          ],
          'Advanced': [
            { id: 'performance-rendering', title: 'Frontend Performance', description: 'Optimization and Core Web Vitals.' }
          ],
          'Pro': []
        }
      },
      {
        id: 'backend-core',
        title: 'Phase 2: The Backend Engine',
        description: 'Mastering Node.js, Express.js, REST APIs, and Authentication patterns.',
        difficulties: {
          'Beginner': [
            { id: 'nodejs-intro', title: 'Node.js Runtime', description: 'JavaScript on the server.' }
          ],
          'Intermediate': [
            { id: 'express-apis', title: 'Express.js & REST APIs', description: 'Building scalable endpoints.' },
            { id: 'auth-jwt', title: 'Auth & JWT', description: 'Securing your application.' }
          ],
          'Advanced': [
            { id: 'middleware-patterns', title: 'Advanced Middleware', description: 'Custom logic and pattern design.' }
          ],
          'Pro': []
        }
      },
      {
        id: 'database-management',
        title: 'Phase 3: Data Control',
        description: 'PostgreSQL, NoSQL (MongoDB), CRUD, and performance indexing.',
        difficulties: {
          'Beginner': [
            { id: 'sql-basics', title: 'SQL & PostgreSQL', description: 'Relational data management.' }
          ],
          'Intermediate': [
            { id: 'nosql-mongodb', title: 'NoSQL & MongoDB', description: 'Document-based flexibility.' },
            { id: 'crud-ops', title: 'Advanced CRUD Operations', description: 'Complex data manipulation.' }
          ],
          'Advanced': [
            { id: 'indexing-perf', title: 'Indexing & Performance', description: 'Optimizing database queries.' }
          ],
          'Pro': []
        }
      },
      {
        id: 'integration-logic',
        title: 'Phase 4: Full-Stack Integration',
        description: 'Connecting Frontend to Backend, end-to-end data flow and processing.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [
            { id: 'data-fetching', title: 'Unified Data Fetching', description: 'TanStack Query & Fetch API.' }
          ],
          'Advanced': [
            { id: 'end-to-end-flow', title: 'E2E Data Lifecycle', description: 'Processing data from UI to DB.' }
          ],
          'Pro': []
        }
      },
      {
        id: 'pro-tools',
        title: 'Phase 5: Professional Toolkit',
        description: 'Testing (Postman), Docker containerization, and Nginx reverse proxies.',
        difficulties: {
          'Beginner': [
            { id: 'postman-testing', title: 'API Testing with Postman', description: 'Validating your backend logic.' }
          ],
          'Intermediate': [
            { id: 'docker-basics', title: 'Docker Essentials', description: 'Containerizing your applications.' }
          ],
          'Advanced': [
            { id: 'nginx-reverse-proxy', title: 'Nginx Configuration', description: 'Managing traffic and security.' }
          ],
          'Pro': []
        }
      },
      {
        id: 'deployment-cicd',
        title: 'Phase 6: Deployment & Scaling',
        description: 'Hosting (Vercel, DigitalOcean), CI/CD pipelines, and Infrastructure.',
        difficulties: {
          'Beginner': [
            { id: 'hosting-basics', title: 'Platform Hosting', description: 'Vercel & Railway deployment.' }
          ],
          'Intermediate': [
            { id: 'cicd-pipelines', title: 'GitHub Actions & CI/CD', description: 'Automating your workflow.' }
          ],
          'Advanced': [
            { id: 'infrastructure-aws', title: 'Cloud Infrastructure', description: 'Scaling with AWS/GCP.' }
          ],
          'Pro': []
        }
      },
      {
        id: 'advanced-architecture',
        title: 'Phase 7: Beyond the Basics',
        description: 'WebSockets, Microservices, Security, and Caching with Redis.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [
            { id: 'websockets-realtime', title: 'Real-time WebSockets', description: 'Live bidirectional communication.' }
          ],
          'Advanced': [
            { id: 'microservices-scale', title: 'Microservices Architecture', description: 'Decoupling large systems.' },
            { id: 'caching-redis', title: 'Caching with Redis', description: 'Extreme performance boost.' }
          ],
          'Pro': [
            { id: 'oauth-advanced', title: 'OAuth & OpenID Connect', description: 'Global identity management.' }
          ]
        }
      }
    ]
  },
  'cybersecurity': {
    id: 'cybersecurity',
    title: 'Cybersecurity & InfoSec',
    description: 'Learn ethical hacking, cryptography, and securing infrastructure against breaches.',
    topics: [
      {
        id: 'phase-0-mindset',
        title: 'Phase 0: BASIC MINDSET',
        description: 'Hardware, OS (Windows/Linux), Networking intro, and Virtualization (VirtualBox).',
        difficulties: {
          'Beginner': [
            { id: 'hardware-sec', title: 'Hardware Fundamentals', description: 'Computing architecture for security.' },
            { id: 'virtualbox-setup', title: 'Virtualization & Labs', description: 'Isolating environments with VirtualBox.' }
          ],
          'Intermediate': [],
          'Advanced': [],
          'Pro': []
        }
      },
      {
        id: 'phase-1-technical-core',
        title: 'Phase 1: TECHNICAL CORE',
        description: 'Deep Linux (Kali), Bash Scripting, and Networking Protocols (TCP/IP, DNS, Ports).',
        difficulties: {
          'Beginner': [
            { id: 'kali-linux', title: 'Kali Linux Mastery', description: 'Advanced OS for security engineers.' },
            { id: 'networking-protocols', title: 'Networking Architecture', description: 'Deep dive into TCP/IP and DNS.' }
          ],
          'Intermediate': [],
          'Advanced': [],
          'Pro': []
        }
      },
      {
        id: 'phase-2-weapon-building',
        title: 'Phase 2: WEAPON BUILDING',
        description: 'Programming for Hackers (Python for scripting, JS for Web, C++ for systems).',
        difficulties: {
          'Beginner': [],
          'Intermediate': [
            { id: 'python-hacking', title: 'Python for Hackers', description: 'Automating tasks and writing tools.' },
            { id: 'js-web-attacks', title: 'JS for Web Security', description: 'Browser-side vulnerability research.' }
          ],
          'Advanced': [
            { id: 'cpp-systems', title: 'C++ for Systems Hackers', description: 'Low-level memory management and exploits.' }
          ],
          'Pro': []
        }
      },
      {
        id: 'phase-3-web-security',
        title: 'Phase 3: WEB SECURITY',
        description: 'Frontend/Backend architecture, SQL, and vulnerabilities (SQLi, XSS, CSRF).',
        difficulties: {
          'Beginner': [],
          'Intermediate': [
            { id: 'sqli-payloads', title: 'SQL Injection Mastery', description: 'Database exfiltration techniques.' },
            { id: 'xss-cross-site', title: 'Advanced XSS', description: 'Client-side code injection.' }
          ],
          'Advanced': [
            { id: 'backend-vulnerabilities', title: 'Backend Logic Attacks', description: 'Breaking business logic.' }
          ],
          'Pro': []
        }
      },
      {
        id: 'phase-4-tools-mastery',
        title: 'Phase 4: TOOLS MASTERY',
        description: 'Industrial tools training (Nmap, Wireshark, Metasploit, Burp Suite).',
        difficulties: {
          'Beginner': [],
          'Intermediate': [
            { id: 'nmap-scanning', title: 'Nmap Network Scanning', description: 'Enumeration and service discovery.' },
            { id: 'wireshark-analysis', title: 'Wireshark Packet Deep-Dive', description: 'Packet analysis and forensics.' }
          ],
          'Advanced': [
            { id: 'metasploit-fw', title: 'Metasploit Framework', description: 'Exploitation and post-exploitation.' },
            { id: 'burp-suite', title: 'Burp Suite Professional', description: 'Web application testing.' }
          ],
          'Pro': []
        }
      },
      {
        id: 'phase-5-lab-training',
        title: 'Phase 5: LAB TRAINING',
        description: 'CTF setups and platforms like TryHackMe and Hack The Box.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [],
          'Advanced': [],
          'Pro': [
            { id: 'htb-mastery', title: 'Hack The Box Excellence', description: 'Solving retired and active machine boxes.' },
            { id: 'ctf-strategies', title: 'CTF Game Theory', description: 'Capture the flag speed and strategy.' }
          ]
        }
      },
      {
        id: 'phase-6-specialization',
        title: 'Phase 6: SPECIALIZATION',
        description: 'Advanced paths (Red Team/Pentesting, Blue Team/Defense, Malware Analysis, Security Engineering).',
        difficulties: {
          'Beginner': [],
          'Intermediate': [],
          'Advanced': [],
          'Pro': [
            { id: 'red-team-ops', title: 'Red Team Operations', description: 'Adversary simulation at scale.' },
            { id: 'malware-analysis', title: 'Reverse Engineering', description: 'Analyzing and dismantling threats.' }
          ]
        }
      }
    ]
  },
  'web3-development': {
    id: 'web3-development',
    title: 'Web3 Development',
    description: 'Master decentralized applications, smart contracts, and blockchain ecosystem.',
    topics: [
      {
        id: 'web3-mindset',
        title: 'Phase 0: The Web3 Mindset',
        description: 'Transitioning from Web2 to Web3: Decentralization, Blockchain, and Ownership.',
        difficulties: {
          'Beginner': [
            { id: 'web3-intro', title: 'What is Web3?', description: 'Understanding the decentralized revolution.' }
          ],
          'Intermediate': [],
          'Advanced': [],
          'Pro': []
        }
      },
      {
        id: 'blockchain-protocols',
        title: 'Phase 1: Blockchain Protocols',
        description: 'Blocks, Mining, Gas Fees, and Ethereum/Polygon networks.',
        difficulties: {
          'Beginner': [
            { id: 'blockchain-basics', title: 'Blockchain Mechanics', description: 'How blocks and chains actually work.' }
          ],
          'Intermediate': [
            { id: 'ethereum-polygon', title: 'Ethereum vs Polygon', description: 'Layer 1 vs Layer 2 scaling.' }
          ],
          'Advanced': [],
          'Pro': []
        }
      },
      {
        id: 'wallets-identity',
        title: 'Phase 2: Assets & Identity',
        description: 'Public/Private Keys, Wallets (MetaMask), and Signing Transactions.',
        difficulties: {
          'Beginner': [
            { id: 'digital-wallets', title: 'Digital Wallets 101', description: 'Setting up and securing your wallet.' }
          ],
          'Intermediate': [
            { id: 'keys-signing', title: 'Keys & Cryptography', description: 'The math behind ownership.' }
          ],
          'Advanced': [],
          'Pro': []
        }
      },
      {
        id: 'solidity-mastery',
        title: 'Phase 3: Smart Contracts Core',
        description: 'Solidity basics: Variables, Functions, Modifiers, and Error Handling.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [
            { id: 'solidity-syntax', title: 'Solidity Fundamentals', description: 'Writing your first smart contract.' }
          ],
          'Advanced': [
            { id: 'complex-modifiers', title: 'Advanced Modifiers', description: 'Securing contract execution.' }
          ],
          'Pro': []
        }
      },
      {
        id: 'web3-dev-tools',
        title: 'Phase 4: Developer Ecosystem',
        description: 'Remix IDE, Hardhat framework, and local testing with Ganache.',
        difficulties: {
          'Beginner': [
            { id: 'remix-ide', title: 'Fast Prototyping with Remix', description: 'Deploying in seconds.' }
          ],
          'Intermediate': [
            { id: 'hardhat-workflow', title: 'Professional Hardhat', description: 'Testing & deployment scripts.' }
          ],
          'Advanced': [],
          'Pro': []
        }
      },
      {
        id: 'dapp-frontend-integration',
        title: 'Phase 5: DApp Integration',
        description: 'React + Ethers.js: Connecting wallets and interacting with contracts.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [
            { id: 'ethers-js-basics', title: 'Introduction to Ethers.js', description: 'Bridging web and blockchain.' }
          ],
          'Advanced': [
            { id: 'event-listening', title: 'Blockchain Event Hooks', description: 'Real-time UI updates from on-chain.' }
          ],
          'Pro': []
        }
      },
      {
        id: 'web3-projects',
        title: 'Phase 6: Real-World DApps',
        description: 'NFT Marketplaces, ERC-20 Tokens, and DAO Voting Systems.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [],
          'Advanced': [
            { id: 'erc20-token', title: 'Building custom tokens', description: 'Launching your own cryptocurrency.' },
            { id: 'nft-minting', title: 'NFT Collection Launch', description: 'IPFS and metadata standards.' }
          ],
          'Pro': [
            { id: 'dao-governance', title: 'DAO Governance Systems', description: 'Decentralized voting logic.' }
          ]
        }
      },
      {
        id: 'advanced-defi-l2',
        title: 'Phase 7: Advanced DeFi & L2',
        description: 'Liquidity/Lending, Scaling (Arbitrum/Optimism), and Oracles (Chainlink).',
        difficulties: {
          'Beginner': [],
          'Intermediate': [],
          'Advanced': [
            { id: 'defi-protocols', title: 'DeFi Mechanics', description: 'Liquidity pools and lending.' }
          ],
          'Pro': [
            { id: 'l2-optimism-arbitrum', title: 'L2 Scaling Strategies', description: 'Optimistic vs ZK rollups.' },
            { id: 'chainlink-oracles', title: 'Chainlink Oracle Data', description: 'Bringing real-world data on-chain.' }
          ]
        }
      },
      {
        id: 'web3-security-auditing',
        title: 'Phase 8: Security & Auditing',
        description: 'Smart Contract Auditing, Reentrancy Attacks, and Common Vulnerabilities.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [],
          'Advanced': [],
          'Pro': [
            { id: 'reentrancy-attacks', title: 'Reentrancy & Gas Attacks', description: 'The DAO hack and how to prevent it.' },
            { id: 'security-audit-checklist', title: 'Smart Contract Auditing', description: 'Professional auditing patterns.' }
          ]
        }
      }
    ]
  },
  'ai-machine-learning': {
    id: 'ai-machine-learning',
    title: 'AI & Machine Learning',
    description: 'Master the neural architecture, from mathematical foundations to deep learning deployment.',
    topics: [
      {
        id: 'ai-vs-programming',
        title: 'Phase 0: The AI Mindset',
        description: 'Traditional Programming (Rules + Data) vs Machine Learning (Data + Results).',
        difficulties: {
          'Beginner': [
            { id: 'ai-intro', title: 'What is Artificial Intelligence?', description: 'Beyond hardcoded logic.' }
          ],
          'Intermediate': [],
          'Advanced': [],
          'Pro': []
        }
      },
      {
        id: 'mathematics-for-ai',
        title: 'Phase 1: The Mathematical Armor',
        description: 'Linear Algebra, Probability, Statistics, and Calculus for optimization.',
        difficulties: {
          'Beginner': [
            { id: 'math-foundation', title: 'Calculus & Algebra for AI', description: 'The math behind the models.' }
          ],
          'Intermediate': [
            { id: 'statistics-prob', title: 'Probability & Statistics', description: 'Making sense of data noise.' }
          ],
          'Advanced': [],
          'Pro': []
        }
      },
      {
        id: 'python-data-science-stack',
        title: 'Phase 2: The Control Languages',
        description: 'Industry standard Python: NumPy, Pandas, and Matplotlib.',
        difficulties: {
          'Beginner': [
            { id: 'python-ai-intro', title: 'Python for Data Science', description: 'Why Python is the king of AI.' }
          ],
          'Intermediate': [
            { id: 'numpy-pandas-mastery', title: 'NumPy & Pandas Mastery', description: 'Efficient numerical computing.' }
          ],
          'Advanced': [],
          'Pro': []
        }
      },
      {
        id: 'data-analysis-eda',
        title: 'Phase 3: Data Handling & EDA',
        description: 'Data Cleaning, Exploratory Data Analysis, and Jupyter Notebooks.',
        difficulties: {
          'Beginner': [
            { id: 'eda-basics', title: 'Exploratory Data Analysis', description: 'Finding patterns in raw data.' }
          ],
          'Intermediate': [
            { id: 'data-cleaning-standard', title: 'Data Cleaning Standards', description: 'Handling missing values and outliers.' }
          ],
          'Advanced': [],
          'Pro': []
        }
      },
      {
        id: 'machine-learning-fundamentals',
        title: 'Phase 4: Machine Learning Core',
        description: 'Supervised, Unsupervised, and Reinforcement Learning using Scikit-learn.',
        difficulties: {
          'Beginner': [
            { id: 'ml-types', title: 'Types of Machine Learning', description: 'Supervised vs Unsupervised.' }
          ],
          'Intermediate': [
            { id: 'regression-classification', title: 'Regression & Classification', description: 'Predicting values and labels.' }
          ],
          'Advanced': [
            { id: 'clustering-k-means', title: 'Clustering & K-Means', description: 'Grouping unlabeled data.' }
          ],
          'Pro': []
        }
      },
      {
        id: 'deep-learning-neural-networks',
        title: 'Phase 5: Deep Learning & Neural Nets',
        description: 'TensorFlow, PyTorch, ANN, CNN, RNN, and Transformers.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [
            { id: 'neural-network-basics', title: 'Neural Network Architecture', description: 'Layers, weights, and biases.' }
          ],
          'Advanced': [
            { id: 'cnn-for-vision', title: 'CNN for Computer Vision', description: 'Image recognition architectures.' },
            { id: 'transformers-nlp', title: 'Transformers & NLP', description: 'The power of attention mechanisms.' }
          ],
          'Pro': []
        }
      },
      {
        id: 'ai-real-world-applications',
        title: 'Phase 6: AI Applications',
        description: 'Computer Vision, Natural Language Processing, and Speech Recognition.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [],
          'Advanced': [
            { id: 'nlp-applications', title: 'NLP in Practice', description: 'Sentiment analysis and translation.' }
          ],
          'Pro': [
            { id: 'speech-recognition-eng', title: 'Speech Engineering', description: 'Building voice-to-text systems.' }
          ]
        }
      },
      {
        id: 'ai-projects-lab',
        title: 'Phase 7: Neural Projects',
        description: 'Classifiers, Recommendation Systems, and custom Chatbots.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [],
          'Advanced': [
            { id: 'spam-classifier', title: 'Spam Classifier Project', description: 'Building a real-world tool.' }
          ],
          'Pro': [
            { id: 'recommendation-engines', title: 'Recommendation Engines', description: 'Building custom ranking systems.' },
            { id: 'chatbot-development', title: 'Chatbot Architecture', description: 'Large language model integration.' }
          ]
        }
      },
      {
        id: 'ai-model-deployment',
        title: 'Phase 8: Deployment & Cloud',
        description: 'FastAPI, AWS/GCP, and Hugging Face model sharing.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [],
          'Advanced': [],
          'Pro': [
            { id: 'api-wrapping-models', title: 'API Model Wrapping', description: 'Using FastAPI & Flask.' },
            { id: 'cloud-ml-deployment', title: 'Cloud-Scale Deployment', description: 'AWS SageMaker & GCP Vertex AI.' },
            { id: 'huggingface-sharing', title: 'Hugging Face Ecosystem', description: 'Model sharing and versioning.' }
          ]
        }
      }
    ]
  },
  'data-engineering': {
    id: 'data-engineering',
    title: 'Data Engineering',
    description: 'Master the movement, transformation, and reliability of data at scale.',
    topics: [
      {
        id: 'data-mindset',
        title: 'Phase 0: The Data Mindset',
        description: 'Understanding how data flows through systems. Structured vs Unstructured data.',
        difficulties: {
          'Beginner': [
            { id: 'data-flow-intro', title: 'The Data Ecosystem', description: 'Why Data Engineering is the backbone of AI.' }
          ],
          'Intermediate': [],
          'Advanced': [],
          'Pro': []
        }
      },
      {
        id: 'data-core-fundamentals',
        title: 'Phase 1: The Core Fundamentals',
        description: 'SQL mastery, Linux/Bash scripting, and Python for data manipulation.',
        difficulties: {
          'Beginner': [
            { id: 'sql-for-data-eng', title: 'SQL for Data Engineers', description: 'Joins, Schema Design, and Optimization.' }
          ],
          'Intermediate': [
            { id: 'bash-scripting', title: 'Bash & Server Management', description: 'Automating data tasks on Linux.' }
          ],
          'Advanced': [],
          'Pro': []
        }
      },
      {
        id: 'etl-mastery',
        title: 'Phase 2: The Heart of Data - ETL',
        description: 'Extract, Transform, and Load: The core of the data pipeline.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [
            { id: 'etl-process', title: 'Mastering the ETL Cycle', description: 'API/DB Extraction and Data Cleaning.' }
          ],
          'Advanced': [],
          'Pro': []
        }
      },
      {
        id: 'data-engineering-tools',
        title: 'Phase 3: The Modern Toolkit',
        description: 'Orchestration (Airflow), Streaming (Kafka), and Processing (Spark).',
        difficulties: {
          'Beginner': [],
          'Intermediate': [
            { id: 'airflow-orchestration', title: 'Apache Airflow Basics', description: 'Scheduling and monitoring pipelines.' }
          ],
          'Advanced': [
            { id: 'kafka-spark-stream', title: 'Kafka & Spark Streaming', description: 'Real-time data processing engines.' }
          ],
          'Pro': []
        }
      },
      {
        id: 'data-warehousing',
        title: 'Phase 4: Data Warehousing',
        description: 'Organizing data for massive analytical queries with BigQuery and Redshift.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [],
          'Advanced': [
            { id: 'warehouse-strategy', title: 'Warehouse Architecture', description: 'OLAP vs OLTP and Schema Modeling.' }
          ],
          'Pro': []
        }
      },
      {
        id: 'big-data-systems',
        title: 'Phase 5: Big Data Systems',
        description: 'Distributed Systems architecture and Batch vs. Streaming processing.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [],
          'Advanced': [],
          'Pro': [
            { id: 'distributed-systems', title: 'Distributed Architecture', description: 'Scaling data systems horizontally.' }
          ]
        }
      },
      {
        id: 'data-pipelines-architecture',
        title: 'Phase 6: Building Data Pipelines',
        description: 'API to Database to Dashboard: Real-time Kafka + Spark pipelines.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [],
          'Advanced': [],
          'Pro': [
            { id: 'e2e-data-pipeline', title: 'E2E Pipeline Build', description: 'Constructing a professional data flow.' }
          ]
        }
      },
      {
        id: 'cloud-data-engineering',
        title: 'Phase 7: Cloud Data Engineering',
        description: 'AWS and Google Cloud (GCP) S3, Serverless, and Cloud Compute.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [],
          'Advanced': [],
          'Pro': [
            { id: 'cloud-native-data', title: 'Cloud-Native Architecture', description: 'Leveraging AWS/GCP for data scale.' }
          ]
        }
      },
      {
        id: 'advanced-data-governance',
        title: 'Phase 8: Advanced Governance',
        description: 'Data Lakes vs. Warehouses, Governance, Quality Control, and Monitoring.',
        difficulties: {
          'Beginner': [],
          'Intermediate': [],
          'Advanced': [],
          'Pro': [
            { id: 'data-integrity-ops', title: 'Data Quality & Observability', description: 'Ensuring trust in the data pipeline.' }
          ]
        }
      }
    ]
  }
};
