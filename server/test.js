const http = require("k6/http");
const { sleep } = require("k6");

export const options = {
  vus: 100,
  duration: "20m",
  cloud: {
    // Project: slidee-backend
    projectID: 3713148,
    // Test runs with the same name groups test runs together.
    name: "Test (08/09/2024-18:24:16)",
  },
  // stages: [
  //   { duration: '2m', target: 2000 }, // fast ramp-up to a high point
  //   // No plateau
  //   { duration: '1m', target: 0 }, // quick ramp-down to 0 users
  // ],
  // thresholds: {
  //   http_req_failed: ['rate<0.01'], // http errors should be less than 1%
  //   http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
  // },
};

export default function () {
  http.post(
    "http://localhost:3000/api/v1/products/",
    JSON.stringify({
      name: "Test",
      price: 100,
      description: "Test",
      countInStock: 100,
      images: "",
      category: "Test",
      role: "Seller",
      
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
sleep(1);
