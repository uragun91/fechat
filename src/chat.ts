import './styles.css'

interface IMessage {
  date: Date,
  user: string,
  text: string
}

function init() {
  if (!window.sessionStorage.getItem('currentUser')) {
    const userName = window.prompt('Please introduce yourself')
    window.sessionStorage.setItem('currentUser', userName)
  }

  const currentUserName = window.sessionStorage.getItem('currentUser')

  const messagesHistory = getMessagesFromStorage()
  messagesHistory.forEach((message: IMessage) => {
    appendMessage(message)
  })

  window.addEventListener('storage', (event: StorageEvent) => {
    if (event.key === 'messages') {
      const messagesWrapper = document.getElementById('messages')
      messagesWrapper.innerHTML = ''
      const messagesHistory = getMessagesFromStorage()
      messagesHistory.forEach((message: IMessage) => {
        appendMessage(message)
      })
    }
  })

  const sendMessageButton = document.getElementById('send-message')
  sendMessageButton.addEventListener('click', () => {
    const messageTextElement = document.getElementById('message-text') as HTMLTextAreaElement
    const messageText = messageTextElement.value
    if (messageText) {
      const message = { date: new Date(), user: currentUserName, text: messageText }
      messagesHistory.push(message)
      window.localStorage.setItem('messages', JSON.stringify(messagesHistory))

      appendMessage(message)

      messageTextElement.value = ''
    }
  })

}

function appendMessage(message: IMessage) {
  let messageElement = document.createElement('div')
    messageElement.classList.add('message')
    let messageTemplate = `
      <div class="message-title">
        <span class="user-name">${message.user}</span>
        <span class="message-time>${message.date}</span>
      </div>
      <div class="message-text">${message.text}</div>
    `

    messageElement.innerHTML = messageTemplate

    const messagesWrapper = document.getElementById('messages')
    messagesWrapper.appendChild(messageElement)
}

function getMessagesFromStorage(): IMessage[] {
  const messagesHistoryJSON = window.localStorage.getItem('messages')
  let messagesHistory: IMessage[]
  try {
    messagesHistory = JSON.parse(messagesHistoryJSON)
  } catch (e) {
    // do nothing
  }
  if (!messagesHistory) {
    messagesHistory = []
  }

  return messagesHistory
}

window.addEventListener('load', function() {
  init()
})