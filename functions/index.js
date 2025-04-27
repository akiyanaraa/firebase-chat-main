const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Filter = require('bad-words');  // Подключаем библиотеку для фильтрации
admin.initializeApp();

const filter = new Filter();  // Создаем экземпляр фильтра

// Функция для фильтрации сообщений
exports.filterMessage = functions.firestore
  .document('chats/{chatId}/messages/{messageId}') // Срабатывает при добавлении нового сообщения
  .onCreate((snapshot, context) => {
    const message = snapshot.data();  // Получаем данные нового сообщения
    const messageText = message.text;  // Извлекаем текст сообщения

    // Проверяем, если в сообщении есть нецензурные слова
    if (filter.isProfane(messageText)) {
      const censoredMessage = filter.clean(messageText);  // Заменяем нецензурные слова на ***

      // Обновляем сообщение с цензурированным текстом
      return snapshot.ref.update({
        text: censoredMessage,
        censored: true  // Добавляем флаг, что сообщение было отцензурировано
      });
    }

    return null;  // Если нецензурных слов нет, ничего не меняем
  });
