import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'create table if not exists menuitems (id integer primary key not null, name text, price text, description text, image text, category text);'
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql('select * from menuitems', [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

export function saveMenuItems(menuItems) {
  db.transaction((tx) => {
    menuItems.forEach((item) => {
      tx.executeSql(
        'insert into menuitems (name, price, description, image, category) values (?, ?, ?, ?, ?)',
        [item.name, item.price, item.description, item.image, item.category]
      );
    });
  });
}

export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      let sql = 'select * from menuitems where name like ?';
      const params = [`%${query}%`];

      if (activeCategories.length > 0) {
        const placeholders = activeCategories.map(() => '?').join(',');
        sql += ` and category in (${placeholders})`;
        params.push(...activeCategories);
      }

      tx.executeSql(
        sql,
        params,
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}
