/*
    Sends a record of all API usage to a Discord channel.
*/

require("dotenv").config({ path: "src/data/.env" });

const axios = require("axios");

class APIRecords {
    async send({ type, endpoint, payload }) {
        const DATA = {
            embeds: [
                {
                    title: "API Record",
                    fields: [
                        {
                            name: "Endpoint",
                            value: `\`${endpoint}\``,
                        },
                        {
                            name: "Method",
                            value: `${type}`,
                        },
                        {
                            name: "Payload",
                            value: `\`\`\`\n${payload || "N/A"}\n\`\`\``,
                        },
                    ],
                },
            ],
        };

        await axios.post(process.env.API_RECORDS_WEBHOOK, DATA);
    }
}

module.exports = new APIRecords();
