// База данных книг
const booksDatabase = {
  1: {
    title: "Самурай без меча",
    author: "Китами Масао",
    cover: "img/Самурай.jpg",
    description: "История воина, идущего по пути чести без оружия, только с верой и мудростью.",
    content: [
      "Глава 1. Начало пути",
      "В далекой провинции Японии жил молодой самурай по имени Такеши...",
      "Глава 2. Испытания",
      "Каждый день приносил новые испытания...",
    ],
    currentPage: 1,
    bookmarks: [],
    downloadUrl: "books/samurai.pdf",
    genre: "fiction",
    isPopular: true,
    isNew: true
  },
  2: {
    title: "И дольше века длится день",
    author: "Чингиз Айтматов",
    cover: "img/Чынгыз.jpg",
    description: "Философский роман о жизни и судьбе человека в современном мире.",
    content: [
      "Глава 1. Утро",
      "Раннее утро в маленьком казахском ауле...",
      "Глава 2. Воспоминания",
      "Старые фотографии оживали в памяти...",
    ],
    currentPage: 1,
    bookmarks: [],
    downloadUrl: "books/aitmatov.pdf",
    genre: "fiction",
    isPopular: true,
    isNew: false
  },
  3: {
    title: "Война и мир",
    author: "Лев Толстой",
    cover: "img/лев толстой.jpg",
    description: "Великий роман о войне и мире, любви и предательстве.",
    content: [
      "Том 1. Часть 1",
      "В июле 1805 года Анна Павловна Шерер...",
      "Том 1. Часть 2",
      "Князь Василий не обдумывал своих планов...",
    ],
    currentPage: 1,
    bookmarks: [],
    downloadUrl: "books/war_and_peace.pdf",
    genre: "fiction",
    isPopular: true,
    isNew: false
  },
  4: {
    title: "Стихи",
    author: "Алишер Навои",
    cover: "img/Алишер.jpg",
    description: "Сборник стихов великого узбекского поэта и мыслителя.",
    content: [
      "Газель 1",
      "О любви и красоте...",
      "Газель 2",
      "О мудрости и жизни...",
    ],
    currentPage: 1,
    bookmarks: [],
    downloadUrl: "books/navoi.pdf",
    genre: "poetry",
    isPopular: true,
    isNew: true
  }
};

// Состояние приложения
const state = {
  currentBook: null,
  isDarkTheme: false,
  fontSize: 16,
  searchQuery: '',
  readingHistory: [],
  currentPage: 'home',
  isSubscribed: false,
  subscription: null
};

// Состояние пользователя
const userState = {
  isAuthenticated: false,
  user: null
};

// Функции для навигации
function navigateTo(page) {
  // Скрываем все страницы
  document.querySelectorAll('.content-page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Показываем выбранную страницу
  const targetPage = document.getElementById(page);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // Обновляем активный пункт меню
  document.querySelectorAll('.menu-list-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === page) {
      item.classList.add('active');
    }
  });
  
  // Если пользователь не админ и пытается открыть админ-панель, перенаправляем на страницу оплаты
  if (page === 'admin' && (!userState.isAuthenticated || !userState.isAdmin)) {
    navigateTo('payment');
  }

  state.currentPage = page;
  
  // Загружаем контент для страницы
  loadPageContent(page);
}

function loadPageContent(page) {
  switch(page) {
    case 'library':
      loadLibraryContent();
      break;
    case 'genres':
      loadGenresContent();
      break;
    case 'popular':
      loadPopularContent();
      break;
    case 'new':
      loadNewContent();
      break;
    case 'payment':
      loadPaymentContent();
      break;
  }
}

function loadLibraryContent() {
  const wrapper = document.querySelector('#library .book-list-wrapper');
  wrapper.innerHTML = '';
  
  // Загружаем книги из истории чтения
  state.readingHistory.forEach(book => {
    const bookData = booksDatabase[book.id];
    if (bookData) {
      wrapper.appendChild(createBookElement(bookData));
    }
  });
}

function loadGenresContent() {
  const grid = document.querySelector('#genres .categories-grid');
  grid.innerHTML = '';
  
  // Создаем элементы для каждого жанра
  const genres = {
    fiction: 'Художественная литература',
    science: 'Научная литература',
    education: 'Образование',
    business: 'Бизнес'
  };
  
  Object.entries(genres).forEach(([id, name]) => {
    const item = document.createElement('div');
    item.className = 'category-item';
    item.dataset.genre = id;
    item.innerHTML = `
      <i class="fas fa-book-open"></i>
      <span>${name}</span>
    `;
    grid.appendChild(item);
  });
}

function loadPopularContent() {
  const wrapper = document.querySelector('#popular .book-list-wrapper');
  wrapper.innerHTML = '';
  
  // Загружаем популярные книги
  Object.values(booksDatabase)
    .filter(book => book.isPopular)
    .forEach(book => {
      wrapper.appendChild(createBookElement(book));
    });
}

function loadNewContent() {
  const wrapper = document.querySelector('#new .book-list-wrapper');
  wrapper.innerHTML = '';
  
  // Загружаем новые книги
  Object.values(booksDatabase)
    .filter(book => book.isNew)
    .forEach(book => {
      wrapper.appendChild(createBookElement(book));
    });
}

function loadPaymentContent() {
  // Проверяем статус подписки
  const subscribeButtons = document.querySelectorAll('.subscribe-button');
  subscribeButtons.forEach(button => {
    button.disabled = state.isSubscribed;
    button.textContent = state.isSubscribed ? 'Подписка активна' : 'Оформить подписку';
  });
}

function createBookElement(book) {
  const element = document.createElement('div');
  element.className = 'book-list-item';
  element.dataset.bookId = book.id;
  element.innerHTML = `
    <img class="book-list-item-img" src="${book.cover}" alt="Обложка книги">
    <span class="book-list-item-title">${book.title}</span>
    <div class="book-actions">
      <button class="read-button">Читать</button>
      <button class="download-button"><i class="fas fa-download"></i></button>
      <button class="bookmark-button"><i class="fas fa-bookmark"></i></button>
    </div>
  `;
  return element;
}

// Функции для работы с книгами
function openBook(bookId) {
  if (!state.isSubscribed) {
    alert('Для чтения книг необходима подписка');
    navigateTo('payment');
    return;
  }

  const book = booksDatabase[bookId];
  if (!book) return;

  state.currentBook = book;
  const reader = document.getElementById('reader');
  const bookContent = document.getElementById('bookContent');
  
  bookContent.innerHTML = book.content.map((text, index) => {
    if (index % 2 === 0) {
      return `<h2>${text}</h2>`;
    } else {
      return `<p>${text}</p>`;
    }
  }).join('');

  document.getElementById('currentPage').textContent = book.currentPage;
  document.getElementById('totalPages').textContent = Math.ceil(book.content.length / 2);

  reader.classList.add('active');
  document.body.style.overflow = 'hidden';

  addToReadingHistory(bookId);
}

function closeReader() {
  const reader = document.getElementById('reader');
  reader.classList.remove('active');
  document.body.style.overflow = '';
  state.currentBook = null;
}

function changePage(direction) {
  if (!state.currentBook) return;

  const totalPages = Math.ceil(state.currentBook.content.length / 2);
  const newPage = state.currentBook.currentPage + direction;

  if (newPage >= 1 && newPage <= totalPages) {
    state.currentBook.currentPage = newPage;
    document.getElementById('currentPage').textContent = newPage;
    
    // Прокручиваем к текущей странице
    const bookContent = document.getElementById('bookContent');
    const pageHeight = bookContent.clientHeight / totalPages;
    bookContent.scrollTo({
      top: (newPage - 1) * pageHeight,
      behavior: 'smooth'
    });

    // Обновляем прогресс
    const progress = (newPage / totalPages) * 100;
    document.querySelector('.progress').style.width = `${progress}%`;

    // Сохраняем прогресс
    saveReadingProgress(state.currentBook.id, newPage);
  }
}

function toggleBookmark() {
  if (!state.currentBook) return;

  const currentPage = state.currentBook.currentPage;
  const bookmarkIndex = state.currentBook.bookmarks.indexOf(currentPage);

  if (bookmarkIndex === -1) {
    state.currentBook.bookmarks.push(currentPage);
  } else {
    state.currentBook.bookmarks.splice(bookmarkIndex, 1);
  }

  // Обновляем иконку закладки
  const bookmarkButton = document.querySelector('.reader-controls .bookmark-button');
  bookmarkButton.style.color = bookmarkIndex === -1 ? '#ff6b6b' : '#666';

  // Сохраняем закладки
  saveBookmarks(state.currentBook.id, state.currentBook.bookmarks);
}

function changeFontSize(delta) {
  state.fontSize = Math.max(12, Math.min(24, state.fontSize + delta));
  document.getElementById('bookContent').style.fontSize = `${state.fontSize}px`;
  localStorage.setItem('fontSize', state.fontSize);
}

// Функция для активации тарифа
function activatePlan(planType) {
  if (planType === 'free') {
    state.subscription = {
      type: 'free',
      active: true,
      downloadLimit: 5,
      downloadsUsed: 0
    };
    localStorage.setItem('subscription', JSON.stringify(state.subscription));
    alert('Бесплатный тариф успешно активирован!');
  } else {
    // Обработка платных тарифов
    // ... existing code ...
  }
}

// Функция для проверки возможности скачивания
function canDownloadBook() {
  if (!state.subscription || !state.subscription.active) {
    alert('Для скачивания книг необходимо активировать тариф');
    return false;
  }
  
  if (state.subscription.type === 'free' && 
      state.subscription.downloadsUsed >= state.subscription.downloadLimit) {
    alert('Вы достигли лимита скачиваний на бесплатном тарифе');
    return false;
  }
  
  return true;
}

// Функция для скачивания книги
function downloadBook(bookId) {
  if (!canDownloadBook()) return;
  
  const book = booksDatabase[bookId];
  if (!book) return;
  
  // Увеличиваем счетчик скачиваний для бесплатного тарифа
  if (state.subscription.type === 'free') {
    state.subscription.downloadsUsed++;
    localStorage.setItem('subscription', JSON.stringify(state.subscription));
  }
  
  // Создаем ссылку для скачивания
  const link = document.createElement('a');
  link.href = book.downloadUrl;
  link.download = `${book.title}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Добавляем в историю скачиваний
  addToDownloadHistory(bookId);
}

// Функции для работы с историей
function addToReadingHistory(bookId) {
  const book = booksDatabase[bookId];
  if (!book) return;

  const historyItem = {
    id: bookId,
    title: book.title,
    author: book.author,
    timestamp: new Date().toISOString()
  };

  state.readingHistory.unshift(historyItem);
  if (state.readingHistory.length > 10) {
    state.readingHistory.pop();
  }

  saveHistory();
}

function addToDownloadHistory(bookId) {
  const book = booksDatabase[bookId];
  if (!book) return;

  const downloadItem = {
    id: bookId,
    title: book.title,
    author: book.author,
    timestamp: new Date().toISOString()
  };

  const downloadHistory = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
  downloadHistory.unshift(downloadItem);
  if (downloadHistory.length > 10) {
    downloadHistory.pop();
  }
  localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
}

function saveHistory() {
  localStorage.setItem('readingHistory', JSON.stringify(state.readingHistory));
}

function saveReadingProgress(bookId, page) {
  const progress = JSON.parse(localStorage.getItem('readingProgress') || '{}');
  progress[bookId] = page;
  localStorage.setItem('readingProgress', JSON.stringify(progress));
}

function saveBookmarks(bookId, bookmarks) {
  const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
  savedBookmarks[bookId] = bookmarks;
  localStorage.setItem('bookmarks', JSON.stringify(savedBookmarks));
}

// Функции для работы с темой
function toggleTheme() {
  state.isDarkTheme = !state.isDarkTheme;
  document.body.classList.toggle('dark-theme', state.isDarkTheme);
  
  const themeButton = document.querySelector('.theme-button');
  themeButton.innerHTML = state.isDarkTheme 
    ? '<i class="fas fa-sun"></i>' 
    : '<i class="fas fa-moon"></i>';
  
  localStorage.setItem('theme', state.isDarkTheme ? 'dark' : 'light');
}

// Функции для поиска
function searchBooks(query) {
  state.searchQuery = query.toLowerCase();
  const bookItems = document.querySelectorAll('.book-list-item');
  
  bookItems.forEach(item => {
    const title = item.querySelector('.book-list-item-title').textContent.toLowerCase();
    const author = booksDatabase[item.dataset.bookId].author.toLowerCase();
    
    if (title.includes(state.searchQuery) || author.includes(state.searchQuery)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

// Функции для работы с подпиской
function subscribe(plan) {
  // Здесь должна быть интеграция с платежной системой
  state.isSubscribed = true;
  localStorage.setItem('subscription', JSON.stringify({
    plan: plan,
    startDate: new Date().toISOString()
  }));
  loadPaymentContent();
  alert('Подписка успешно оформлена!');
}

// Функция для инициализации Google Sign-In
function initializeGoogleSignIn() {
  google.accounts.id.initialize({
    client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
    callback: handleGoogleSignIn
  });
  
  google.accounts.id.renderButton(
    document.getElementById('googleAuth'),
    { theme: 'outline', size: 'large' }
  );
}

// Функция для проверки админ-доступа
function checkAdminAccess(email) {
  const adminEmails = ['ekokonbaev9@gmail.com'];
  return adminEmails.includes(email);
}

// Обновляем функцию handleGoogleSignIn
function handleGoogleSignIn(response) {
  const user = response.credential;
  const payload = JSON.parse(atob(user.split('.')[1]));
  
  userState = {
    isAuthenticated: true,
    name: payload.name,
    email: payload.email,
    picture: payload.picture,
    isAdmin: checkAdminAccess(payload.email)
  };
  
  localStorage.setItem('userState', JSON.stringify(userState));
  updateUserUI();
  
  // Если пользователь не админ, показываем страницу оплаты
  if (!userState.isAdmin) {
    navigateTo('payment');
  } else {
    // Если админ, показываем админ-панель
    navigateTo('admin');
  }
}

// Функция для обновления UI после авторизации
function updateUserUI() {
  const userAvatar = document.getElementById('userAvatar');
  const userName = document.getElementById('userName');
  const profileMenu = document.querySelector('.profile-menu');
  
  if (userState.isAuthenticated) {
    userAvatar.src = userState.picture;
    userName.textContent = userState.name;
    
    // Обновляем меню профиля
    profileMenu.innerHTML = `
      <div class="profile-menu-item" data-action="profile">Мой профиль</div>
      <div class="profile-menu-item" data-action="library">Моя библиотека</div>
      ${userState.isAdmin ? '<div class="profile-menu-item" data-action="admin">Админ-панель</div>' : ''}
      <div class="profile-menu-item" data-action="settings">Настройки</div>
      <div class="profile-menu-item" data-action="logout">Выйти</div>
    `;
  } else {
    userAvatar.src = 'img/default-avatar.png';
    userName.textContent = 'Войти';
    profileMenu.innerHTML = '';
  }
}

// Функция для выхода из аккаунта
function signOut() {
  userState.isAuthenticated = false;
  userState.user = null;
  localStorage.removeItem('userState');
  updateUserUI();
  navigateTo('home');
}

// Функции для работы с админ-панелью
function addNewBook() {
  const title = document.getElementById('bookTitle').value;
  const author = document.getElementById('bookAuthor').value;
  const description = document.getElementById('bookDescription').value;
  const genre = document.getElementById('bookGenre').value;
  const content = document.getElementById('bookContent').value.split('\n\n');
  const coverFile = document.getElementById('bookCover').files[0];
  const pdfFile = document.getElementById('bookPdf').files[0];

  if (!title || !author || !description || !genre || !content || !coverFile || !pdfFile) {
    alert('Пожалуйста, заполните все поля');
    return;
  }

  // Создаем уникальный ID для книги
  const bookId = Object.keys(booksDatabase).length + 1;

  // Создаем URL для обложки и PDF
  const coverUrl = URL.createObjectURL(coverFile);
  const pdfUrl = URL.createObjectURL(pdfFile);

  // Добавляем книгу в базу данных
  booksDatabase[bookId] = {
    id: bookId,
    title: title,
    author: author,
    cover: coverUrl,
    description: description,
    content: content,
    currentPage: 1,
    bookmarks: [],
    downloadUrl: pdfUrl,
    genre: genre,
    isPopular: false,
    isNew: true
  };

  // Сохраняем изменения
  saveBooksToLocalStorage();

  // Обновляем список книг
  updateAdminBooksList();

  // Очищаем форму
  clearAdminForm();

  alert('Книга успешно добавлена!');
}

function updateAdminBooksList() {
  const booksList = document.getElementById('adminBooksList');
  booksList.innerHTML = '';

  Object.values(booksDatabase).forEach(book => {
    const bookElement = document.createElement('div');
    bookElement.className = 'admin-book-item';
    bookElement.innerHTML = `
      <img src="${book.cover}" alt="${book.title}">
      <h4>${book.title}</h4>
      <p>Автор: ${book.author}</p>
      <p>Жанр: ${getGenreName(book.genre)}</p>
      <div class="admin-book-actions">
        <button class="edit-button" onclick="editBook(${book.id})">Редактировать</button>
        <button class="delete-button" onclick="deleteBook(${book.id})">Удалить</button>
      </div>
    `;
    booksList.appendChild(bookElement);
  });
}

function editBook(bookId) {
  const book = booksDatabase[bookId];
  if (!book) return;

  // Заполняем форму данными книги
  document.getElementById('bookTitle').value = book.title;
  document.getElementById('bookAuthor').value = book.author;
  document.getElementById('bookDescription').value = book.description;
  document.getElementById('bookGenre').value = book.genre;
  document.getElementById('bookContent').value = book.content.join('\n\n');

  // Обновляем обработчик кнопки
  const addButton = document.getElementById('addBook');
  addButton.textContent = 'Обновить книгу';
  addButton.onclick = () => updateBook(bookId);

  // Прокручиваем к форме
  document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth' });
}

function updateBook(bookId) {
  const book = booksDatabase[bookId];
  if (!book) return;

  // Обновляем данные книги
  book.title = document.getElementById('bookTitle').value;
  book.author = document.getElementById('bookAuthor').value;
  book.description = document.getElementById('bookDescription').value;
  book.genre = document.getElementById('bookGenre').value;
  book.content = document.getElementById('bookContent').value.split('\n\n');

  // Обновляем файлы, если они были изменены
  const coverFile = document.getElementById('bookCover').files[0];
  const pdfFile = document.getElementById('bookPdf').files[0];

  if (coverFile) {
    book.cover = URL.createObjectURL(coverFile);
  }
  if (pdfFile) {
    book.downloadUrl = URL.createObjectURL(pdfFile);
  }

  // Сохраняем изменения
  saveBooksToLocalStorage();

  // Обновляем список книг
  updateAdminBooksList();

  // Очищаем форму
  clearAdminForm();

  // Восстанавливаем кнопку добавления
  const addButton = document.getElementById('addBook');
  addButton.textContent = 'Добавить книгу';
  addButton.onclick = addNewBook;

  alert('Книга успешно обновлена!');
}

function deleteBook(bookId) {
  if (!confirm('Вы уверены, что хотите удалить эту книгу?')) return;

  delete booksDatabase[bookId];
  saveBooksToLocalStorage();
  updateAdminBooksList();
  alert('Книга успешно удалена!');
}

function clearAdminForm() {
  document.getElementById('bookTitle').value = '';
  document.getElementById('bookAuthor').value = '';
  document.getElementById('bookCover').value = '';
  document.getElementById('bookDescription').value = '';
  document.getElementById('bookGenre').value = 'fiction';
  document.getElementById('bookPdf').value = '';
  document.getElementById('bookContent').value = '';
}

function getGenreName(genre) {
  const genres = {
    fiction: 'Художественная литература',
    science: 'Научная литература',
    education: 'Образование',
    business: 'Бизнес',
    poetry: 'Поэзия'
  };
  return genres[genre] || genre;
}

function saveBooksToLocalStorage() {
  localStorage.setItem('booksDatabase', JSON.stringify(booksDatabase));
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Восстанавливаем настройки
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    toggleTheme();
  }

  const savedFontSize = localStorage.getItem('fontSize');
  if (savedFontSize) {
    state.fontSize = parseInt(savedFontSize);
  }

  const savedHistory = localStorage.getItem('readingHistory');
  if (savedHistory) {
    state.readingHistory = JSON.parse(savedHistory);
  }

  const savedSubscription = localStorage.getItem('subscription');
  if (savedSubscription) {
    state.isSubscribed = true;
    state.subscription = JSON.parse(savedSubscription);
  }

  // Восстанавливаем прогресс чтения
  const progress = JSON.parse(localStorage.getItem('readingProgress') || '{}');
  Object.entries(progress).forEach(([bookId, page]) => {
    if (booksDatabase[bookId]) {
      booksDatabase[bookId].currentPage = page;
    }
  });

  // Восстанавливаем закладки
  const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
  Object.entries(savedBookmarks).forEach(([bookId, bookmarks]) => {
    if (booksDatabase[bookId]) {
      booksDatabase[bookId].bookmarks = bookmarks;
    }
  });

  // Обработчики для навигации
  document.querySelectorAll('.menu-list-item, .menu-item').forEach(item => {
    item.addEventListener('click', () => {
      navigateTo(item.dataset.page);
    });
  });

  // Обработчики для кнопок чтения
  document.querySelectorAll('.read-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const bookId = e.target.closest('.book-list-item').dataset.bookId;
      openBook(bookId);
    });
  });

  // Обработчики для кнопок скачивания
  document.querySelectorAll('.download-button').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const bookId = e.target.closest('.book-list-item').dataset.bookId;
      downloadBook(bookId);
    });
  });

  // Обработчики для кнопок подписки
  document.querySelectorAll('.subscribe-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const plan = e.target.closest('.payment-plan').querySelector('h3').textContent;
      subscribe(plan);
    });
  });

  // Обработчики для читалки
  document.querySelector('.reader-close').addEventListener('click', closeReader);
  document.querySelector('.prev-page').addEventListener('click', () => changePage(-1));
  document.querySelector('.next-page').addEventListener('click', () => changePage(1));
  document.querySelector('.bookmark-button').addEventListener('click', toggleBookmark);
  
  // Обработчики для управления шрифтом
  document.querySelector('.font-size-button').addEventListener('click', () => {
    changeFontSize(2);
  });

  // Обработчик для переключения темы
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Обработчик для поиска
  const searchInput = document.querySelector('.search-input');
  searchInput.addEventListener('input', (e) => {
    searchBooks(e.target.value);
  });

  // Обработчики для кнопок закладок в списке книг
  document.querySelectorAll('.bookmark-button').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const bookId = e.target.closest('.book-list-item').dataset.bookId;
      const book = booksDatabase[bookId];
      
      if (book) {
        const bookmarkIndex = book.bookmarks.indexOf(book.currentPage);
        if (bookmarkIndex === -1) {
          book.bookmarks.push(book.currentPage);
          button.style.color = '#ff6b6b';
        } else {
          book.bookmarks.splice(bookmarkIndex, 1);
          button.style.color = '#666';
        }
        saveBookmarks(bookId, book.bookmarks);
      }
    });
  });

  // Обработчики для кнопок тарифов
  document.querySelectorAll('.activate-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const planType = e.target.dataset.plan;
      activatePlan(planType);
    });
  });

  // Проверяем, авторизован ли пользователь
  const savedUser = localStorage.getItem('userState');
  if (savedUser) {
    userState.isAuthenticated = true;
    userState.user = JSON.parse(savedUser);
    updateUserUI();
  }
  
  // Инициализируем Google Sign-In
  initializeGoogleSignIn();
  
  // Обработчики для профиля
  const profileInfo = document.querySelector('.profile-info');
  profileInfo.addEventListener('click', () => {
    if (userState.isAuthenticated) {
      // Показываем меню профиля
      showProfileMenu();
    } else {
      // Переходим на страницу авторизации
      navigateTo('auth');
    }
  });
  
  // Обработчик для выхода из аккаунта
  document.getElementById('userAvatar').addEventListener('click', (e) => {
    e.stopPropagation();
    if (userState.isAuthenticated) {
      signOut();
    }
  });

  // Загружаем книги из localStorage
  const savedBooks = localStorage.getItem('booksDatabase');
  if (savedBooks) {
    Object.assign(booksDatabase, JSON.parse(savedBooks));
  }

  // Обработчик для кнопки добавления книги
  document.getElementById('addBook').addEventListener('click', addNewBook);

  // Обновляем список книг в админ-панели
  updateAdminBooksList();
});

// Функция для показа меню профиля
function showProfileMenu() {
  const menu = document.createElement('div');
  menu.className = 'profile-menu';
  menu.innerHTML = `
    <div class="profile-menu-item" data-action="profile">
      <i class="fas fa-user"></i>
      <span>Мой профиль</span>
    </div>
    <div class="profile-menu-item" data-action="library">
      <i class="fas fa-book"></i>
      <span>Моя библиотека</span>
    </div>
    <div class="profile-menu-item" data-action="settings">
      <i class="fas fa-cog"></i>
      <span>Настройки</span>
    </div>
    <div class="profile-menu-item" data-action="logout">
      <i class="fas fa-sign-out-alt"></i>
      <span>Выйти</span>
    </div>
  `;
  
  document.body.appendChild(menu);
  
  // Обработчики для пунктов меню
  menu.querySelectorAll('.profile-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const action = e.currentTarget.dataset.action;
      switch(action) {
        case 'profile':
          navigateTo('profile');
          break;
        case 'library':
          navigateTo('library');
          break;
        case 'settings':
          navigateTo('settings');
          break;
        case 'logout':
          signOut();
          break;
      }
      menu.remove();
    });
  });
  
  // Закрытие меню при клике вне его
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !profileInfo.contains(e.target)) {
      menu.remove();
    }
  });
}
