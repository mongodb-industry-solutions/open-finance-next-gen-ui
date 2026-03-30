// talkTrack.js
export const TALK_TRACK = [
  {
    heading: "How to Demo",
    content: [
      {
        body: "Learn how to use MongoDB Atlas and agentic AI to streamline Open Finance consent flows for credit portability.  This solution showcases an open finance ecosystem and demonstrates secure financial data sharing between institutions."
      },
      {
        body: [
          "- Follow the chatbot suggestions (green bubbles above the input).",
          "- You will be redirected to the third-party institution of your choice to approve the consent.",
          "- Everything is made up for demo purposes, of course."
        ]
      }
    ]
  },
  {
    heading: "Behind the Scenes",
    content: [
     
      {
        body: [
          "**MongoDB Vector Search, MongoDB MCP Server, MongoDB Queryable Encryption** form the backbone of this solution.",
          "**MongoDB Atlas** serves as the operational data layer that underpins these open finance architectures."
        ]
      },
      {
        heading: "Core Capabilities",
        body: [
          "- **Queryable Encryption for consent privacy**: Protect consumer identity across every consent lifecycle event — creation, authorization, data retrieval, and revocation. The server never sees plaintext. You query encrypted fields with standard equality filters without changing application code.",
          "- **Agentic data access with the MongoDB MCP Server**: Expose MongoDB collections as tools that LLM agents invoke directly. The internal data agent can answer natural language queries autonomously, no custom tool code required.",
          "- **Supervisor agent orchestration**: LangGraph orchestrates specialized agents — Consent Agent, Portability Agent, and Internal Data Agent — and persists conversation state through checkpoint collections in MongoDB Atlas."
        ]
      },
      {
        image: {
          src: "/behind-the-scenes.png",
          alt: "Architecture overview"
        }
      }
    ]
  },
  {
    heading: "Why MongoDB",
    content: [
      {
        body: [
          "MongoDB Atlas key capabilities in this solution:",
          "- **Persisting LangGraph conversation state**: through checkpoint collections.",
          "- **Running aggregation pipelines**: compute balances, debt totals, portability savings, and spending scores across internal and external data.",
          "- **Separating data in a dual-database architecture**: internal (`leafy_bank`) and external (`open_finance`) aligned with Open Finance and ISO 20022-style transaction models.",
          "- **Unify open finance data on MongoDB Atlas**: Reduce integration complexity by consolidating internal and external datasets.",
          "- **Simplify analytics with aggregation pipelines**: Compute balances, debt totals, portability savings, and spending scores in a single query path.",
          "- **Protect sensitive consent data with queryable encryption**: Query sensitive fields while maintaining strong privacy controls.",
          "- **Streamline consent journeys with agentic AI**: Use LangGraph-based multi-agent chatbots to reduce abandonment and improve customer experience.",
          "- **Align data structures with ISO 20022 best practices**: Standardize external transaction fields and codes across institutions."
        ]
      }
    ]
  }
];