export async function POST(request) {
  try {
    const body = await request.json();
    const { messages } = body;

    // You should use an environment variable for the API key in production
    const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || "your-groq-api-key-here";
    const GROQ_url = "https://api.groq.com/openai/v1/chat/completions";

    let responseText = "";
    
    try {
      // Try to call the Groq API if a valid key is provided
      if (GROQ_API_KEY && GROQ_API_KEY !== "your-groq-api-key-here") {
        const response = await fetch(GROQ_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama3-8b-8192", // or mixtral-8x7b-32768 or gemma-7b-it
            messages: messages,
            temperature: 0.7,
            max_tokens: 1024
          })
        });

        if (!response.ok) {
          throw new Error(`Groq API returned ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        responseText = data.choices[0].message.content;
      } else {
        // DEMO MODE: Provide a mock response if no API key is available
        const userQuery = messages[messages.length - 1].content;
        
        if (userQuery.toLowerCase().includes("sales")) {
          responseText = "Here's the sales data for JSW Steel for the last 6 months:\n\n" +
            "Our domestic sales have shown strong growth, particularly in Q2 with an 8% increase compared to the previous quarter. " +
            "The highest revenue month was April, with total sales of ₹81 Crores. " +
            "Our sales team attributes this success to the new marketing strategies implemented earlier this year.";
        } else if (userQuery.toLowerCase().includes("production")) {
          responseText = "JSW Steel's production output has been steadily increasing over the last 4 quarters:\n\n" +
            "1. Q1 showed a baseline production of 12,000 metric tons\n" +
            "2. Q2 saw a significant jump to 19,000 metric tons due to new facility expansions\n" +
            "3. Q3 had a slight decrease to 15,000 metric tons during maintenance periods\n" +
            "4. Q4 reached our highest output of 22,000 metric tons after optimization initiatives\n\n" +
            "This represents an overall 83% increase in production capacity from Q1 to Q4.";
        } else if (userQuery.toLowerCase().includes("compare") || userQuery.toLowerCase().includes("comparison")) {
          responseText = "Here's a comparison of our top product categories by market share:\n\n" +
            "Product A: 35%\n" +
            "Product B: 25%\n" +
            "Product C: 22%\n" +
            "Product D: 18%\n\n" +
            "Product A continues to be our flagship offering, though Products B and C have shown stronger growth rates in the past two quarters.";
        } else if (userQuery.toLowerCase().includes("growth") || userQuery.toLowerCase().includes("trend")) {
          responseText = "JSW Steel has maintained consistent growth over the past 5 years, with projections for continued expansion:\n\n" +
            "2019: 3.2% growth\n" +
            "2020: 1.4% growth (impacted by global events)\n" +
            "2021: 2.8% growth (recovery phase)\n" +
            "2022: 4.5% growth (strong performance)\n" +
            "2023: 3.9% growth\n" +
            "2024: 5.1% projected growth\n\n" +
            "Our strategic investments in automation and capacity expansion are expected to drive the higher growth projected for 2024.";
        } else if (userQuery.toLowerCase().includes("distribution") || userQuery.toLowerCase().includes("market")) {
          responseText = "JSW Steel's market distribution breakdown:\n\n" +
            "- Domestic market: 45%\n" +
            "- Asian exports: 25%\n" +
            "- European exports: 20%\n" +
            "- Other international markets: 10%\n\n" +
            "We've seen a 5% increase in European exports over the last year due to new trade agreements and growing demand for specialized steel products.";
        } else {
          responseText = "Thank you for your question about JSW Steel. As your AI assistant, I'm here to provide information about our products, services, and company data. Could you specify which particular aspect of JSW Steel you'd like to learn more about? I can provide details about our sales figures, production capacity, market distribution, or product comparisons.";
        }
      }
    } catch (error) {
      console.error("API call error:", error);
      responseText = "I apologize, but I'm having trouble connecting to my knowledge database right now. As JSW's AI assistant, I can tell you that we're one of India's leading steel manufacturers with a diverse product portfolio. Please try your specific query again later when my connections are restored.";
    }
    
    // Detect chart type based on user query
    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    
    // Generate different types of charts based on the query content
    let hasChart = false;
    let chartData = null;
    
    if (lastMessage.includes("sales") || lastMessage.includes("revenue") || lastMessage.includes("profit")) {
      hasChart = true;
      chartData = {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [{
            label: "Sales Data (₹ Crores)",
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: "#4A81DD"
          }]
        }
      };
    } else if (lastMessage.includes("production") || lastMessage.includes("manufacturing") || lastMessage.includes("output")) {
      hasChart = true;
      chartData = {
        type: "line",
        data: {
          labels: ["Q1", "Q2", "Q3", "Q4"],
          datasets: [{
            label: "Production Output (Metric Tons)",
            data: [12000, 19000, 15000, 22000],
            borderColor: "#36A2EB",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            tension: 0.4,
            fill: true
          }]
        }
      };
    } else if (lastMessage.includes("comparison") || lastMessage.includes("compare") || lastMessage.includes("versus")) {
      hasChart = true;
      chartData = {
        type: "pie",
        data: {
          labels: ["Product A", "Product B", "Product C", "Product D"],
          datasets: [{
            data: [35, 25, 22, 18],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]
          }]
        }
      };
    } else if (lastMessage.includes("growth") || lastMessage.includes("trend") || lastMessage.includes("forecast")) {
      hasChart = true;  
      chartData = {
        type: "line",
        data: {
          labels: ["2019", "2020", "2021", "2022", "2023", "2024 (Projected)"],
          datasets: [{
            label: "Annual Growth (%)",
            data: [3.2, 1.4, 2.8, 4.5, 3.9, 5.1],
            borderColor: "#4BC0C0",
            backgroundColor: "transparent",
            pointBackgroundColor: "#4BC0C0",
            pointRadius: 5
          }]
        }
      };
    } else if (lastMessage.includes("distribution") || lastMessage.includes("market share") || lastMessage.includes("allocation")) {
      hasChart = true;
      chartData = {
        type: "doughnut",
        data: {
          labels: ["Domestic", "Export - Asia", "Export - Europe", "Export - Others"],
          datasets: [{
            data: [45, 25, 20, 10],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]
          }]
        }
      };
    }

    // Return structured response
    return Response.json({ 
      message: responseText,
      chatdata: chartData,
      haschart: hasChart
    });
  } catch (error) {
    console.error("Error processing chat request:", error);
    return Response.json(
      { error: "Failed to process request", message: error.message },
      { status: 500 }
    );
  }
} 