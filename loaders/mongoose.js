const mongoose = require('mongoose')
mongoose.connect(
  'mongodb://127.0.0.1/chat_app',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) console.log('Connected successfully!')
  }
)
