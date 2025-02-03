# 🗨️ Chat App with LLaMA Bot (@bot Feature)

This is a simple real-time chat application where users can chat with each other and interact with an AI-powered LLaMA bot using the `@bot` feature.

## 🚀 Features
- Real-time messaging between multiple users
- AI bot responses triggered with `@bot`
- Clean, concise, and fast bot replies
- User-friendly chat interface

## ⚙️ Prerequisites
- **Node.js** (v14 or higher)
- **npm** (Node package manager)
- **LLaMA Model** installed locally (with `llama-cli` available)

## 📦 Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/SangeethaKumari/broadcastmessagesystem.git
   cd broadcastmessagesystem
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Ensure LLaMA Model is in the Correct Path:**
   ```
   ../llama.cpp/models/ggml-model-f16.gguf
   ```

## ▶️ Running the Application

Start the server:
```bash
node server.js
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤖 How to Use the `@bot` Feature
- **Trigger the bot by typing:**
  ```
  @bot Tell me a joke
  ```
- The LLaMA bot will respond with a helpful and concise answer.

## 🚧 Troubleshooting
- **No Response from Bot?**
  - Ensure the LLaMA model is working:
    ```bash
    ../llama.cpp/build/bin/llama-cli -m ../llama.cpp/models/ggml-model-f16.gguf --prompt "Hello"
    ```
  - Check for errors in the terminal where the server is running.

- **Bot Takes Too Long to Respond?**
  - The bot has a 5-second timeout. If exceeded, it will reply:
    ```
    Sorry, the response took too long.
    ```

## 💡 Customization
- **Adjust Response Length:**
  In `server.js`, modify `--n-predict` to change the token limit:
  ```javascript
  '--n-predict', '50' // Increase or decrease this value
  ```

- **Change Timeout Duration:**
  Adjust the timeout value (in milliseconds):
  ```javascript
  let timeout = setTimeout(() => {
      llama.kill('SIGTERM');
      callback("Sorry, the response took too long.");
  }, 5000); // Change 5000 to desired timeout
  ```

## 📄 License
MIT

---

Happy chatting! 🚀

