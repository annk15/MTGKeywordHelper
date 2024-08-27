import connection from '../db.js';

export function getReminders(callback) {
  connection.query('SELECT * FROM keyword_reminders', (error, results) => {
    if (error) {
      return callback(error, null);
    }
    callback(null, results);
  });
}

export function getImage(keyword, callback) {
  connection.query('SELECT keyword, image FROM keyword_images WHERE keyword = ?', [keyword], (error, results) => {
    if (error) {
      return callback(error, null);
    }
    if (results.length === 0) {
      return callback(null, null);
    }
    callback(null, results[0]);
  });
}
