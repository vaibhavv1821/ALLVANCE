import { SeedInterviewQuestion } from './types';

export const CN_QUESTIONS: SeedInterviewQuestion[] = [
  {
    id: 'cn-01',
    categoryId: 'cs-cn',
    title: 'Explain the 7 Layers of the OSI Model and their responsibilities.',
    difficulty: 'BEGINNER',
    answer:
      'The OSI (Open Systems Interconnection) reference model divides network communication into 7 distinct abstraction layers: 1. Physical Layer: Transmits raw unstructured bitstreams over physical transmission medium (cables, radio waves, repeaters, hubs). 2. Data Link Layer: Node-to-node framing, physical MAC addressing, error detection (CRC), flow control (switches, bridges). 3. Network Layer: Logical host-to-host addressing (IP), packet routing, subnetting across networks (routers). 4. Transport Layer: End-to-end process-to-process communication, port numbers, reliability, segmentation, flow control, congestion control (TCP, UDP). 5. Session Layer: Establishes, manages, and terminates dialogue sessions between applications. 6. Presentation Layer: Data formatting, translation, serialization, encryption (SSL/TLS), and compression. 7. Application Layer: Human-computer interaction protocols (HTTP, HTTPS, FTP, DNS, SMTP).',
    keyPoints: [
      'PDU (Protocol Data Unit) per layer: Bits (Physical) -> Frames (Data Link) -> Packets (Network) -> Segments (Transport) -> Data (App).',
      'TCP/IP model collapses layers 5, 6, and 7 into a single Application layer.',
    ],
    followUps: [
      {
        question: 'At which OSI layer does a Network Router operate vs a Network Switch?',
        answer: 'Routers operate at Layer 3 (Network Layer, using IP addresses); standard Switches operate at Layer 2 (Data Link Layer, using MAC addresses).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro', 'Deloitte', 'HCL'],
    tags: ['OSI Model', 'Layers', 'Networking Basics'],
  },
  {
    id: 'cn-02',
    categoryId: 'cs-cn',
    title: 'Explain the TCP 3-Way Handshake and 4-Way Connection Teardown.',
    difficulty: 'BEGINNER',
    answer:
      'TCP establishes a reliable full-duplex connection using a 3-Way Handshake: 1. Client -> Server: Sends SYN packet with an initial sequence number (ISN_c). State: SYN_SENT. 2. Server -> Client: Replies with SYN-ACK packet, acknowledging client’s sequence number (ACK = ISN_c + 1) and providing server’s initial sequence number (ISN_s). State: SYN_RCVD. 3. Client -> Server: Sends ACK packet (ACK = ISN_s + 1). State: ESTABLISHED. Both sides are synchronized and ready to exchange data. Connection Teardown (4-Way): 1. Host A -> Host B: Sends FIN (ready to close). 2. Host B -> Host A: Sends ACK (connection half-closed; B can still send remaining data). 3. Host B -> Host A: Sends FIN. 4. Host A -> Host B: Sends ACK. Host A enters TIME_WAIT state (2 * MSL) to ensure the ACK reaches B and lingering duplicate packets drain from the network.',
    keyPoints: [
      'ISN is randomized to prevent TCP sequence prediction spoofing attacks.',
      'TIME_WAIT prevents old duplicate packets from interfering with a future new connection on the same port.',
    ],
    followUps: [
      {
        question: 'Why does TCP connection termination require 4 steps while setup requires 3?',
        answer: 'Because TCP is full-duplex; one side can finish sending data (closing half-connection with FIN-ACK) while the other side still has pending data to transmit.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Capgemini', 'HCL'],
    tags: ['TCP', 'Handshake', 'Connection Teardown'],
  },
  {
    id: 'cn-03',
    categoryId: 'cs-cn',
    title: 'What is the difference between TCP and UDP with real-world use cases?',
    difficulty: 'BEGINNER',
    answer:
      'TCP (Transmission Control Protocol) is a connection-oriented, reliable protocol. It guarantees in-order packet delivery, error-checking with retransmission of lost packets, and implements flow control and congestion control. Header size: 20 bytes (up to 60 with options). Use cases: Web browsing (HTTP/HTTPS), file transfers (FTP), emails (SMTP), where data accuracy is critical. UDP (User Datagram Protocol) is a connectionless, lightweight, unreliable "best-effort" protocol. It sends datagrams without establishing a handshake, does not guarantee delivery or packet order, and has no congestion control. Header size: 8 bytes. Use cases: Real-time gaming, live video streaming, VoIP (Zoom, Discord), DNS queries, where low latency is prioritized over packet loss.',
    keyPoints: [
      'TCP: Reliable, ordered, heavy, 20-byte header, congestion-controlled.',
      'UDP: Unreliable, unordered, lightweight, 8-byte header, fast.',
      'HTTP/3 (QUIC) is built on top of UDP to achieve zero-RTT handshakes and eliminate head-of-line blocking.',
    ],
    followUps: [
      {
        question: 'Why does DNS use UDP for queries instead of TCP?',
        answer: 'DNS requests are small (<512 bytes) and require immediate low latency; establishing a 3-way TCP handshake for a single query would triple latency.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['TCP', 'UDP', 'Transport Layer'],
  },
  {
    id: 'cn-04',
    categoryId: 'cs-cn',
    title: 'What happens from the moment you type a URL into a browser until the page renders?',
    difficulty: 'INTERMEDIATE',
    answer:
      'The comprehensive sequence: 1. URL Parsing: Browser parses protocol, domain, port, path. 2. DNS Resolution: Checks Browser DNS cache -> OS cache -> Router cache -> ISP Recursive DNS Resolver (iterative query: Root DNS -> TLD (.com) -> Authoritative Nameserver) to resolve domain to IP. 3. ARP Request: Resolves IP to default gateway router MAC address if not in ARP cache. 4. TCP Handshake: 3-way handshake (SYN, SYN-ACK, ACK) establishes connection on port 80/443. 5. TLS Handshake: (If HTTPS) negotiates cipher suite, verifies server certificate with CA, exchanges symmetric session keys. 6. HTTP Request: Browser sends HTTP GET request with headers and cookies. 7. Server Processing: Web server/load balancer routes to backend, executes database queries, generates HTML. 8. HTTP Response: Server sends response with status code (200 OK) and payload. 9. Browser Rendering: Browser constructs DOM tree and CSSOM tree -> Render Tree -> Layout (Reflow) -> Paint (Rasterize) -> Compositing to screen.',
    keyPoints: [
      'Holistic question testing end-to-end full stack and networking mastery.',
      'Critical stages: DNS, TCP, TLS, HTTP, Browser Rendering Pipeline.',
    ],
    followUps: [
      {
        question: 'How does HTTP Keep-Alive / Persistent Connection optimize step 4?',
        answer: 'It reuses the established TCP connection for multiple subsequent asset requests (CSS, JS, images), avoiding repeat 3-way handshakes.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini', 'Cognizant', 'InfoCepts'],
    tags: ['URL Navigation', 'DNS', 'HTTP', 'End to End'],
  },
  {
    id: 'cn-05',
    categoryId: 'cs-cn',
    title: 'Explain DNS (Domain Name System) resolution flow and record types (A, CNAME, MX, TXT).',
    difficulty: 'INTERMEDIATE',
    answer:
      'DNS translates human-readable domain names into IP addresses. Hierarchy: 1. Client checks local cache (browser, hosts file, OS). 2. Queries Recursive Resolver (ISP or 8.8.8.8). 3. Resolver queries Root Nameserver (.) -> returns TLD server for .com. 4. Resolver queries TLD Nameserver (.com) -> returns Authoritative Nameserver for domain. 5. Resolver queries Authoritative Nameserver -> returns IP address and caches it based on TTL (Time-To-Live). Record Types: A Record (maps domain to IPv4), AAAA Record (maps to IPv6), CNAME (Canonical Name - alias pointing to another domain name), MX (Mail Exchange server for emails), TXT (arbitrary text, used for SPF, DKIM, and domain ownership verification).',
    keyPoints: [
      'TTL specifies how many seconds recursive resolvers may cache the record.',
      'A CNAME cannot coexist with other records at the zone apex/root domain (@).',
    ],
    followUps: [
      {
        question: 'What is an ALIAS or ANAME record?',
        answer: 'A pseudo-record provided by DNS providers that resolves like a CNAME at the root domain (@) but outputs an A record IP to comply with DNS RFCs.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['DNS', 'Records', 'Resolution'],
  },
  {
    id: 'cn-06',
    categoryId: 'cs-cn',
    title: 'Explain the evolution of HTTP: HTTP/1.1 vs HTTP/2 vs HTTP/3.',
    difficulty: 'INTERMEDIATE',
    answer:
      '1. HTTP/1.1: Text-based. Introduced persistent connections (Keep-Alive) and pipelining, but suffered from Head-Of-Line (HOL) Blocking at the application level: requests on the same TCP connection had to be processed sequentially in FIFO order. 2. HTTP/2: Binary framing layer. Introduced Multiplexing: multiple bidirectional request/response streams interleaved concurrently over a single TCP connection, eliminating application HOL blocking. Added HPACK header compression and Server Push. Still suffered from TCP-level HOL blocking (if one packet is lost, all streams stall). 3. HTTP/3: Replaced TCP and TLS with QUIC protocol over UDP. Multiplexed streams operate independently at the transport layer, eliminating TCP-level HOL blocking, and enables 0-RTT connection resumption and connection migration across networks (e.g. Wi-Fi to 5G).',
    keyPoints: [
      'HTTP/2 multiplexes over single TCP; HTTP/3 multiplexes over QUIC/UDP.',
      'QUIC integrates TLS 1.3 cryptographic handshake natively into connection setup.',
    ],
    followUps: [
      {
        question: 'What is Head-of-Line (HOL) blocking in HTTP/1.1?',
        answer: 'When a slow server response for the first request blocks all subsequent queued requests on that same TCP connection.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'InfoCepts'],
    tags: ['HTTP', 'HTTP2', 'HTTP3', 'QUIC'],
  },
  {
    id: 'cn-07',
    categoryId: 'cs-cn',
    title: 'How does HTTPS work? Explain the TLS/SSL Handshake.',
    difficulty: 'INTERMEDIATE',
    answer:
      'HTTPS is HTTP layered over TLS (Transport Layer Security) on port 443, providing Encryption (Confidentiality), Authentication (Identity verification), and Integrity (anti-tamper MAC). TLS Handshake (TLS 1.2/1.3): 1. ClientHello: Client sends supported TLS version, cipher suites list, and random client nonce. 2. ServerHello & Certificate: Server chooses cipher suite, sends server nonce, and provides its Digital Certificate containing its Public Key signed by a trusted CA. 3. Verification: Client verifies certificate chain against pre-installed OS/browser root CA certificates. 4. Key Exchange: In TLS 1.3, an ephemeral Diffie-Hellman key exchange computes a shared Symmetric Session Key. 5. Secure Session: All subsequent application data is encrypted using high-speed symmetric encryption (AES-GCM or ChaCha20).',
    keyPoints: [
      'Asymmetric encryption (RSA/ECC) is used ONLY during the handshake to exchange symmetric keys.',
      'Symmetric encryption (AES-256) is used for actual data transfer because it is ~1,000x faster than asymmetric encryption.',
      'TLS 1.3 reduces handshake latency from 2 round-trips to 1 round-trip (1-RTT).',
    ],
    followUps: [
      {
        question: 'What is Perfect Forward Secrecy (PFS)?',
        answer: 'A cryptographic property where session keys are ephemeral (Diffie-Hellman); compromising the server’s private key in the future does NOT allow decrypting past recorded traffic.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['HTTPS', 'TLS', 'Security', 'Cryptography'],
  },
  {
    id: 'cn-08',
    categoryId: 'cs-cn',
    title: 'What is Flow Control vs Congestion Control in TCP?',
    difficulty: 'INTERMEDIATE',
    answer:
      'Flow Control protects the RECEIVER from being overwhelmed by a fast sender. Managed using the Sliding Window mechanism: the receiver advertises its available buffer space via the Receive Window (rwnd) field in TCP headers. The sender cannot transmit more bytes than rwnd. Congestion Control protects the ENTIRE NETWORK SUBNET from collapsing due to packet congestion. Managed by the sender using the Congestion Window (cwnd). The effective window is min(rwnd, cwnd). Congestion control algorithms: Slow Start (cwnd doubles exponentially each RTT), Congestion Avoidance (additive increase after reaching ssthresh), Fast Retransmit (retransmits after 3 duplicate ACKs), and Fast Recovery.',
    keyPoints: [
      'Flow control = Receiver buffer limitation (rwnd).',
      'Congestion control = Network pipe bandwidth limitation (cwnd).',
      'TCP Tahoe vs Reno: Reno implements Fast Recovery, avoiding dropping back to 1 MSS on packet loss.',
    ],
    followUps: [
      {
        question: 'What triggers Fast Retransmit in TCP?',
        answer: 'Receiving 3 duplicate ACKs for the same sequence number from the receiver, signaling packet loss without waiting for a retransmission timer timeout.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'HCL'],
    tags: ['TCP', 'Flow Control', 'Congestion Control'],
  },
  {
    id: 'cn-09',
    categoryId: 'cs-cn',
    title: 'Explain Subnetting, Subnet Masks, and CIDR Notation in IPv4.',
    difficulty: 'BEGINNER',
    answer:
      'Subnetting partitions a large network into smaller, manageable subnetworks. An IPv4 address consists of 32 bits divided into a Network ID and Host ID. A Subnet Mask has 1s for network bits and 0s for host bits. Bitwise ANDing an IP with its subnet mask isolates the Network Address. CIDR (Classless Inter-Domain Routing) represents subnet masks by a prefix slash: /24 means 24 network bits and 8 host bits (256 - 2 = 254 usable host IPs; first IP is network address, last is broadcast).',
    example: 'IP 192.168.1.50 with mask 255.255.255.0 (/24): Network address is 192.168.1.0, Broadcast is 192.168.1.255, usable host range is 192.168.1.1 to 192.168.1.254.',
    keyPoints: [
      'Number of usable hosts = 2^(32 - prefix) - 2.',
      'Replaced legacy Classful addressing (Class A, B, C) to reduce IPv4 address depletion.',
    ],
    followUps: [
      {
        question: 'How many usable host IPs are available in a /28 subnet?',
        answer: '32 - 28 = 4 host bits. 2^4 - 2 = 14 usable host IPs.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Subnetting', 'IPv4', 'CIDR'],
  },
  {
    id: 'cn-10',
    categoryId: 'cs-cn',
    title: 'What is ARP (Address Resolution Protocol) and how does it work?',
    difficulty: 'BEGINNER',
    answer:
      'ARP translates a known logical Layer 3 IP address into a physical Layer 2 MAC address within a local area network (LAN). When Host A wants to send a frame to IP B on the same subnet: 1. Host A checks its local ARP Cache table. 2. If absent, Host A broadcasts an ARP Request packet ("Who has IP 192.168.1.5? Tell 192.168.1.2") to MAC FF:FF:FF:FF:FF:FF. 3. All hosts on the LAN receive the broadcast, but only the host with that IP replies with a unicast ARP Reply containing its MAC address. 4. Host A caches the IP-to-MAC mapping and transmits the data frame.',
    keyPoints: [
      'Operates between Data Link (Layer 2) and Network (Layer 3).',
      'ARP poisoning/spoofing is a vulnerability where malicious actors send fake ARP replies to intercept traffic (Man-In-The-Middle).',
    ],
    followUps: [
      {
        question: 'What is Gratuitous ARP?',
        answer: 'An unsolicited ARP broadcast sent by a host to announce its own IP/MAC mapping or detect duplicate IP addresses on the network.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['ARP', 'MAC Address', 'Networking'],
  },
  {
    id: 'cn-11',
    categoryId: 'cs-cn',
    title: 'What is NAT (Network Address Translation) and why is it essential?',
    difficulty: 'INTERMEDIATE',
    answer:
      'NAT is a router technology that maps private IP addresses (RFC 1918: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) used within a local private network to a single public IP address routable on the global internet. The dominant variant is PAT (Port Address Translation / NAT Overload): the router tracks active connections by mapping internal (Private IP + Source Port) combinations to (Public IP + Unique Translated External Port) in a NAT translation table. NAT prolonged the lifespan of IPv4 by decades and provides implicit inbound firewall security.',
    keyPoints: [
      'Conserves scarce public IPv4 address space.',
      'Shields internal network topology from external scanning.',
    ],
    followUps: [
      {
        question: 'Why does NAT cause challenges for peer-to-peer (P2P) connections (like WebRTC)?',
        answer: 'External peers cannot directly initiate inbound connections to private IPs behind NAT; P2P protocols require STUN/TURN servers for NAT traversal.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['NAT', 'PAT', 'IPv4', 'Routing'],
  },
  {
    id: 'cn-12',
    categoryId: 'cs-cn',
    title: 'How do ping and traceroute work? (ICMP and TTL expiration)',
    difficulty: 'INTERMEDIATE',
    answer:
      'Both utilities use ICMP (Internet Control Message Protocol): 1. ping sends an ICMP Echo Request (Type 8) packet to the target IP; the target responds with an ICMP Echo Reply (Type 0). Measures round-trip time and packet loss. 2. traceroute maps the network hop path to a destination using the IP header TTL (Time-To-Live) field. It sends packets with TTL=1; the first router decrements TTL to 0, drops the packet, and returns an ICMP Time Exceeded (Type 11) error, revealing router 1’s IP. It then sends with TTL=2, TTL=3, iteratively discovering every router hop until reaching the destination.',
    keyPoints: [
      'TTL prevents looping packets from circulating forever on the internet.',
      'ICMP operates directly above IP (Layer 3) without TCP or UDP port numbers.',
    ],
    followUps: [
      {
        question: 'Why do some hops in traceroute output display asterisks (* * *)?',
        answer: 'Those intermediate routers are configured with firewall rules that drop ICMP packets or rate-limit ICMP responses.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['ICMP', 'Ping', 'Traceroute'],
  },
  {
    id: 'cn-13',
    categoryId: 'cs-cn',
    title: 'Explain WebSockets vs Server-Sent Events (SSE) vs Long Polling.',
    difficulty: 'INTERMEDIATE',
    answer:
      'Techniques for real-time web communication: 1. Long Polling: Client sends standard HTTP request; server holds request open until new data is available, then replies. Client immediately issues a new request. High HTTP header overhead (~1KB per poll). 2. Server-Sent Events (SSE): Unidirectional streaming from server to client over a persistent HTTP connection using Content-Type: text/event-stream. Lightweight, automatic reconnection, built-in event IDs, but client cannot send data over the stream (must use separate HTTP POSTs). 3. WebSockets: Full-duplex, bidirectional communication over a single persistent TCP connection initiated via an HTTP 101 Switching Protocols upgrade. Extremely low framing overhead (2-10 bytes per message), ideal for live chat, gaming, and collaborative whiteboards.',
    keyPoints: [
      'WebSockets = Bidirectional full-duplex.',
      'SSE = Unidirectional server-to-client streaming over standard HTTP.',
      'Long Polling = Fallback mechanism for legacy environments.',
    ],
    followUps: [
      {
        question: 'When is SSE preferred over WebSockets?',
        answer: 'For one-way streaming (live stock ticker, sports scores, LLM AI token streaming) because it runs over HTTP/2, supports automatic reconnection, and bypasses corporate firewalls.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Cognizant'],
    tags: ['WebSockets', 'SSE', 'Real-Time'],
  },
  {
    id: 'cn-14',
    categoryId: 'cs-cn',
    title: 'What is a CDN (Content Delivery Network) and how does Anycast routing work?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A CDN (Cloudflare, Akamai, CloudFront) is a globally distributed network of edge cache servers (Points of Presence - PoPs) that caches static and dynamic web content (images, CSS, JS, video) close to end-users. Anycast Routing is the routing technique powering modern CDNs: multiple distinct edge server locations globally advertise the EXACT SAME public IP address via BGP (Border Gateway Protocol). When a user sends a packet to that IP, internet routers automatically route the packet to the topologically nearest CDN edge data center, minimizing latency.',
    keyPoints: [
      'Reduces origin server load and protects against volumetric DDoS attacks.',
      'Edge compute (Cloudflare Workers / Lambda@Edge) runs logic right at the CDN edge.',
    ],
    followUps: [
      {
        question: 'How do CDNs handle cache invalidation?',
        answer: 'Via Purge APIs, versioned asset filenames (cache-busting: style.a8f9c.css), or stale-while-revalidate Cache-Control headers.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts', 'Infosys'],
    tags: ['CDN', 'Anycast', 'Caching', 'Architecture'],
  },
  {
    id: 'cn-15',
    categoryId: 'cs-cn',
    title: 'What is DHCP (Dynamic Host Configuration Protocol) and the DORA process?',
    difficulty: 'BEGINNER',
    answer:
      'DHCP automates the assignment of IP addresses, subnet masks, default gateways, and DNS servers to client devices joining a network. The 4-step DORA process: 1. Discover: Client broadcasts DHCPDISCOVER looking for a DHCP server. 2. Offer: DHCP server broadcasts DHCPOFFER with a reserved IP address and configuration. 3. Request: Client broadcasts DHCPREQUEST accepting the offered IP lease. 4. Acknowledge: Server sends DHCPACK confirming the lease.',
    keyPoints: [
      'Operates on UDP ports 67 (server) and 68 (client).',
      'IP addresses are leased for a finite duration (lease time) and must be renewed.',
    ],
    followUps: [
      {
        question: 'What IP address does a Windows client assign itself if DHCP fails?',
        answer: 'An APIPA (Automatic Private IP Addressing) link-local address in the 169.254.0.0/16 range.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['DHCP', 'DORA', 'IP Assignment'],
  },
  {
    id: 'cn-16',
    categoryId: 'cs-cn',
    title: 'Explain Routing Algorithms: Distance Vector vs Link State.',
    difficulty: 'INTERMEDIATE',
    answer:
      '1. Distance Vector (e.g. RIP - Routing Information Protocol): Each router shares its entire routing table with its immediate direct neighbors periodically. Uses Bellman-Ford algorithm ("tells neighbors about the whole world"). Suffers from slow convergence and the Count-to-Infinity problem (mitigated by Split Horizon and Poison Reverse). 2. Link State (e.g. OSPF - Open Shortest Path First): Each router floods information about the state of its directly attached links to ALL routers in the network using Link State Advertisements (LSAs) ("tells the whole world about its neighbors"). Every router builds an identical topological map of the network and computes shortest paths using Dijkstra’s algorithm. Faster convergence, no loops, but higher CPU/memory.',
    keyPoints: [
      'Distance Vector: distributed Bellman-Ford; slow convergence.',
      'Link State: global Dijkstra; fast convergence, loop-free.',
    ],
    followUps: [
      {
        question: 'What is the Count-to-Infinity problem in Distance Vector routing?',
        answer: 'When a link fails, routing loops cause routers to iteratively increment distance metric step-by-step up to infinity (16 in RIP).',
      },
    ],
    companies: ['Infosys', 'Capgemini', 'HCL'],
    tags: ['Routing', 'Distance Vector', 'Link State', 'OSPF'],
  },
  {
    id: 'cn-17',
    categoryId: 'cs-cn',
    title: 'What is BGP (Border Gateway Protocol) and why does the internet rely on it?',
    difficulty: 'ADVANCED',
    answer:
      'BGP is the Path-Vector routing protocol that glues the entire global internet together, routing traffic between independent Autonomous Systems (AS - large networks operated by ISPs, telecom giants, tech titans like Google/Cloudflare). Unlike interior protocols (OSPF) that optimize for shortest physical hops, BGP routes based on network policy, peering agreements, commercial contracts, and path vector attributes (AS-PATH prevents loops).',
    keyPoints: [
      'Operates over reliable TCP connection on port 179.',
      'BGP misconfigurations (route leaks / hijacks) can black-hole global internet traffic.',
    ],
    followUps: [
      {
        question: 'What is an Autonomous System Number (ASN)?',
        answer: 'A globally unique 16-bit or 32-bit identifier assigned by IANA/RIRs identifying an autonomous network routing domain.',
      },
    ],
    companies: ['Deloitte', 'InfoCepts'],
    tags: ['BGP', 'Internet Routing', 'Autonomous Systems'],
  },
  {
    id: 'cn-18',
    categoryId: 'cs-cn',
    title: 'What is the difference between Symmetric and Asymmetric Encryption in Network Security?',
    difficulty: 'BEGINNER',
    answer:
      'Symmetric Encryption uses the same single secret key for both encryption and decryption (e.g. AES, ChaCha20, DES). It is computationally fast and suitable for bulk data transfer, but requires a secure channel to share the key (key distribution problem). Asymmetric Encryption uses a mathematically linked Key Pair: a Public Key (distributed freely for encryption) and a Private Key (kept strictly confidential for decryption) (e.g. RSA, ECC/ECDSA). It solves the key distribution problem, but is ~1,000x slower. Modern protocols (TLS/HTTPS, SSH) use asymmetric encryption to securely exchange a symmetric key, then switch to symmetric encryption for session data.',
    keyPoints: [
      'Symmetric: 1 shared key; very fast; AES-256 is current gold standard.',
      'Asymmetric: Public/Private key pair; slower; used for authentication and key exchange.',
    ],
    followUps: [
      {
        question: 'What is a Digital Signature in asymmetric cryptography?',
        answer: 'A hash of a message encrypted with the sender’s PRIVATE key; anyone with the sender’s public key can verify authenticity and non-repudiation.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['Cryptography', 'Encryption', 'Security'],
  },
  {
    id: 'cn-19',
    categoryId: 'cs-cn',
    title: 'What is CORS (Cross-Origin Resource Sharing) and what are Pre-flight requests?',
    difficulty: 'INTERMEDIATE',
    answer:
      'CORS is an HTTP-header based browser security mechanism enforced under the Same-Origin Policy (SOP). SOP prevents scripts on origin A (e.g. https://client.com) from reading responses from origin B (e.g. https://api.com) unless origin B explicitly permits it via Access-Control-Allow-Origin headers. For "non-simple" requests (requests with custom headers, JSON body Content-Type: application/json, or methods like PUT/DELETE), the browser automatically sends an HTTP OPTIONS Pre-flight request asking the server for permission before sending the actual request.',
    codeExample: `// Browser automatic preflight request:
OPTIONS /api/users HTTP/1.1
Origin: https://client.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization

// Server approval response:
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://client.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization`,
    keyPoints: [
      'CORS is enforced by the BROWSER, not the server (curl or Postman requests bypass CORS).',
      'Origin = Protocol + Domain + Port.',
    ],
    followUps: [
      {
        question: 'Why doesn’t Postman or backend-to-backend API calls fail with CORS errors?',
        answer: 'Because CORS is a browser security sandbox restriction; non-browser HTTP clients do not enforce Same-Origin Policy.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini', 'Cognizant'],
    tags: ['CORS', 'HTTP Headers', 'Web Security'],
  },
  {
    id: 'cn-20',
    categoryId: 'cs-cn',
    title: 'Explain HTTP Status Code Families (1xx, 2xx, 3xx, 4xx, 5xx) with common examples.',
    difficulty: 'BEGINNER',
    answer:
      'HTTP response status codes indicate whether an HTTP request completed successfully: 1. 1xx (Informational): Request received, continuing (101 Switching Protocols for WebSockets). 2. 2xx (Success): Request successfully received and accepted (200 OK, 201 Created, 204 No Content). 3. 3xx (Redirection): Further action needed to complete request (301 Moved Permanently, 302 Found/Temporary, 304 Not Modified for caching). 4. 4xx (Client Error): Request contains bad syntax or cannot be fulfilled (400 Bad Request, 401 Unauthorized [missing auth], 403 Forbidden [authenticated but no permission], 404 Not Found, 429 Too Many Requests). 5. 5xx (Server Error): Server failed to fulfill an apparently valid request (500 Internal Server Error, 502 Bad Gateway [upstream server failed], 503 Service Unavailable, 504 Gateway Timeout).',
    keyPoints: [
      '401 = Not Authenticated (identity unknown); 403 = Not Authorized (identity known, but access denied).',
      '502 vs 504: 502 means reverse proxy received invalid response; 504 means upstream server timed out.',
    ],
    followUps: [
      {
        question: 'What is the difference between 301 and 302 redirects for SEO?',
        answer: '301 passes SEO link equity permanently and is cached aggressively by browsers; 302 does not transfer link equity.',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    tags: ['HTTP Status Codes', 'REST APIs'],
  },
  {
    id: 'cn-21',
    categoryId: 'cs-cn',
    title: 'What is IPv6 and why is it superior to IPv4?',
    difficulty: 'BEGINNER',
    answer:
      'IPv6 is the next-generation internet protocol designed to replace IPv4. Differences: 1. Address Space: IPv4 uses 32-bit addresses (~4.3 billion addresses, exhausted). IPv6 uses 128-bit hexadecimal addresses (~3.4 x 10^38 addresses, practically inexhaustible). 2. Elimination of NAT: Every device can have a globally unique routable IP. 3. Simplified Header: Fixed 40-byte header with fewer fields, accelerating router processing speed. 4. Built-in Security: IPsec support is mandatory in IPv6 specification. 5. Auto-configuration: SLAAC (Stateless Address Autoconfiguration) allows devices to generate their own IP without a DHCP server.',
    keyPoints: [
      'Written in 8 groups of 4 hexadecimal digits separated by colons (e.g. 2001:0db8::ff00:0042:8329).',
      'Dual-stack allows running IPv4 and IPv6 concurrently during migration.',
    ],
    followUps: [
      {
        question: 'What is the loopback address in IPv6?',
        answer: '::1 (equivalent to 127.0.0.1 in IPv4).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Capgemini'],
    tags: ['IPv6', 'IPv4', 'IP Addressing'],
  },
  {
    id: 'cn-22',
    categoryId: 'cs-cn',
    title: 'What is MTU (Maximum Transmission Unit) and IP Packet Fragmentation?',
    difficulty: 'INTERMEDIATE',
    answer:
      'MTU is the largest size packet/frame (in bytes) that a network layer can transmit over a physical link without fragmenting it. Standard Ethernet MTU is 1500 bytes. If an IP packet is larger than an outgoing link’s MTU, IPv4 routers fragment the packet into smaller packets with the same Identification number, setting Fragment Offset and More Fragments (MF) flags. The destination host reassembles them. In IPv6, routers DO NOT fragment packets; Path MTU Discovery (PMTUD) forces the sending host to discover the bottleneck MTU upfront and fragment at the source.',
    keyPoints: [
      'DF (Don’t Fragment) flag: If set and packet > MTU, router drops packet and sends ICMP "Fragmentation Needed".',
      'Packet fragmentation increases packet loss risk (losing 1 fragment loses the entire packet).',
    ],
    followUps: [
      {
        question: 'What is MSS (Maximum Segment Size) in TCP?',
        answer: 'The largest amount of application data that TCP will transmit in a single segment, equal to MTU - (IP header + TCP header) = 1500 - 40 = 1460 bytes.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['MTU', 'Fragmentation', 'IP'],
  },
  {
    id: 'cn-23',
    categoryId: 'cs-cn',
    title: 'What is a Firewall and how do Stateful Inspection firewalls differ from Packet Filters?',
    difficulty: 'INTERMEDIATE',
    answer:
      'A Firewall monitors and filters incoming and outgoing network traffic based on predetermined security rules: 1. Packet Filtering Firewall (Stateless / Layer 3 & 4): Inspects packets individually in isolation (source/destination IP, port, protocol). Fast, but unaware of connection context. 2. Stateful Inspection Firewall: Tracks the state of active network connections in a state table (e.g. tracking TCP handshakes and sequence numbers). It automatically permits inbound response packets if they match an established outbound request, blocking unauthorized unsolicited incoming traffic.',
    keyPoints: [
      'Next-Gen Firewalls (NGFW) inspect Application Layer 7 payload (deep packet inspection).',
      'Stateful firewalls prevent TCP SYN floods and port scans.',
    ],
    followUps: [
      {
        question: 'At which OSI layer does a Web Application Firewall (WAF) operate?',
        answer: 'Layer 7 (Application Layer), inspecting HTTP traffic for SQL injection, XSS, and CSRF attacks.',
      },
    ],
    companies: ['Deloitte', 'Infosys', 'Capgemini'],
    tags: ['Firewalls', 'Network Security', 'Stateful Inspection'],
  },
  {
    id: 'cn-24',
    categoryId: 'cs-cn',
    title: 'What is a Proxy Server vs a Reverse Proxy?',
    difficulty: 'BEGINNER',
    answer:
      'A Forward Proxy sits in front of CLIENTS. When clients make requests to the internet, requests go through the forward proxy. It shields client identity (anonymity), bypasses geographic/corporate firewalls, and filters outgoing traffic. A Reverse Proxy sits in front of BACKEND SERVERS. When clients send requests to a website, the reverse proxy intercepts them and routes them to appropriate internal servers. It provides Load Balancing, SSL/TLS Termination, Caching, and DDoS protection, shielding backend server topology from the public internet (e.g. NGINX, HAProxy).',
    keyPoints: [
      'Forward Proxy protects/represents the Client.',
      'Reverse Proxy protects/represents the Server.',
      'Reverse proxies handle SSL termination to offload cryptographic CPU load from application servers.',
    ],
    followUps: [
      {
        question: 'What HTTP header does a Reverse Proxy add to preserve the client’s real IP address?',
        answer: 'X-Forwarded-For (and X-Forwarded-Proto).',
      },
    ],
    companies: ['TCS', 'Infosys', 'Deloitte', 'Capgemini'],
    tags: ['Proxy', 'Reverse Proxy', 'Architecture'],
  },
  {
    id: 'cn-25',
    categoryId: 'cs-cn',
    title: 'What is a SYN Flood Attack and how do SYN Cookies mitigate it?',
    difficulty: 'ADVANCED',
    answer:
      'A SYN Flood is a Denial of Service (DoS) attack exploiting the TCP 3-way handshake. The attacker sends a barrage of TCP SYN packets with spoofed source IPs. The victim server allocates memory resources in its SYN Backlog Queue for each connection and responds with SYN-ACK. The attacker never sends the final ACK. The server’s backlog queue fills with half-open connections, causing legitimate connection attempts to be rejected. SYN Cookies mitigate this: the server does NOT allocate memory or backlog entries upon receiving a SYN. Instead, it encodes the connection state cryptographically into the Initial Sequence Number (ISN) of the SYN-ACK. When the client sends the final ACK, the server reconstructs and verifies the state from the ACK number.',
    keyPoints: [
      'SYN cookies allow servers to survive massive SYN floods without allocating RAM per pending request.',
      'Standard defense built into Linux kernel (net.ipv4.tcp_syncookies = 1).',
    ],
    followUps: [
      {
        question: 'What trade-off is introduced by enabling SYN cookies?',
        answer: 'Certain TCP options (like large window scales) may be lost if not encoded into the cookie bits.',
      },
    ],
    companies: ['Deloitte', 'Infosys'],
    tags: ['SYN Flood', 'DDoS', 'TCP Security'],
  },
];
