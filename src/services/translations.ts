export type Language = 'en' | 'ru';

export const translations: Record<string, Record<Language, string>> = {
  // Navigation & Shell
  brandName: { en: 'CINESHELF', ru: 'КИНOПOЛКA' },
  tagline: { en: '[LIBRARY.ARCHIVE_FILE]', ru: '[БИБЛИOТEКA.AРХИВ_ФAЙЛ]' },
  navLibrary: { en: 'Library', ru: 'Библиотека' },
  navAnalytics: { en: 'Analytics', ru: 'Аналитика' },
  navSettings: { en: 'Settings', ru: 'Настройки' },
  addFilm: { en: 'ADD FILM', ru: 'ДОБАВИТЬ' },

  // Filters Panel
  searchPlaceholder: { en: 'Search movie queue, director, actors...', ru: 'Поиск фильма, режиссера, актеров...' },
  genreLabel: { en: 'Genre:', ru: 'Жанр:' },
  sortLabel: { en: 'Sort:', ru: 'Сортировка:' },
  allGenres: { en: 'All Genres', ru: 'Все жанры' },
  
  // Sort options
  sortRecentlyAdded: { en: 'Recently Added', ru: 'Недавно добавленные' },
  sortPersonalRating: { en: 'Personal Rating', ru: 'Личная оценка' },
  sortTitle: { en: 'Title (A-Z)', ru: 'По названию (А-Я)' },
  sortReleaseYear: { en: 'Release Year', ru: 'Год выпуска' },
  sortCustom: { en: 'Custom Order', ru: 'Пользовательский порядок' },

  // Watch status tabs
  tabAll: { en: '[ALL.FILES]', ru: '[ВСЕ_ЗАПИСИ]' },
  tabWatched: { en: '[WATCHED]', ru: '[ПРОСМОТРЕНО]' },
  tabWatching: { en: '[WATCHING]', ru: '[СМОТРЮ]' },
  tabPlan: { en: '[PLAN]', ru: '[В ПЛАНАХ]' },
  tabPlanToWatch: { en: '[PLAN_TO_WATCH]', ru: '[В_ПЛАНАХ_ПРОСМОТРА]' },

  // Empty State
  emptyTitle: { en: 'LIBRARY EMPTY', ru: 'БИБЛИОТЕКА ПУСТА' },
  emptySubtext: { en: '[STATUS: INITIAL_STATE_EMPTY_QUEUE]. Begin cataloging watched cinema by importing covers, ratings, plots, and crew roles from public archives.', ru: '[СТАТУС: НАЧАЛЬНОЕ_СОСТОЯНИЕ_ПУСТО]. Начните каталогизацию просмотренного кино, импортируя обложки, рейтинги, сюжеты и роли создателей из публичных архивов.' },
  searchDatabaseBtn: { en: 'SEARCH DATABASE', ru: 'ПОИСК В БАЗЕ' },
  loadMockSeedBtn: { en: 'LOAD MOCK SEED', ru: 'ЗАГРУЗИТЬ ДЕМО-ПАК' },
  noResults: { en: '[NO_RESULTS_MATCH_FILTER_CRITERIA]', ru: '[НЕТ_РЕЗУЛЬТАТОВ_ПО_ФИЛЬТРАМ]' },
  noResultsSub: { en: 'Adjust query parameters or filters.', ru: 'Измените параметры поиска или фильтры.' },

  // Card Overlays
  cardSource: { en: 'via', ru: 'от' },

  // Detail Modal
  starring: { en: 'Starring: ', ru: 'В ролях: ' },
  directorLabel: { en: 'Dir: ', ru: 'Реж: ' },
  apiRating: { en: 'API RATING', ru: 'РEЙТИНГ API' },
  userRating: { en: '[USER_RATING]: ', ru: '[ЛИЧНAЯ_ОЦЕНКA]: ' },
  unrated: { en: 'UNRATED', ru: 'БЕЗ ОЦЕНКИ' },
  statusLabel: { en: 'STATUS', ru: 'СТАТУС' },
  countLabel: { en: 'COUNT', ru: 'ПРОСМОТРЫ' },
  dateLabel: { en: 'DATE', ru: 'ДАТА' },
  tagsLabel: { en: 'TAGS', ru: 'ТЕГИ' },
  addTagPlaceholder: { en: 'ADD TAG (E.G. MASTERPIECE)...', ru: 'ДОБАВИТЬ ТЕГ (НАПР. ШЕДЕВР)...' },
  userReviewLabel: { en: 'USER REVIEW', ru: 'ОТЗЫВ ИЛИ МНЕНИЕ' },
  reviewPlaceholder: { en: 'WRITE CRITIQUE LOG...', ru: 'НАПИШИТЕ ВАШУ РЕЦЕНЗИЮ...' },
  privateNotesLabel: { en: 'PRIVATE NOTES', ru: 'ЛИЧНЫЕ ЗАМЕТКИ' },
  notesPlaceholder: { en: 'ADD PRIVATE ANNOTATIONS...', ru: 'ДОБАВИТЬ ПРИМЕЧАНИЯ...' },
  deleteRecordBtn: { en: 'DELETE RECORD', ru: 'УДАЛИТЬ ЗАПИСЬ' },
  closeBtn: { en: 'CLOSE', ru: 'ЗАКРЫТЬ' },
  saveRecordBtn: { en: 'SAVE RECORD', ru: 'СОХРАНИТЬ' },
  deleteConfirm: { en: 'Are you sure you want to remove this movie from your library?', ru: 'Вы уверены, что хотите удалить этот фильм из вашей библиотеки?' },

  // Search Modal
  searchModalPlaceholder: { en: 'SEARCH LIVE TITLES (E.G. WHIPLASH, MATRIX, INCEPTION)...', ru: 'ПОИСК ФИЛЬМОВ ИЛИ СЕРИАЛОВ (НАПР. МАТРИЦА, ДЮНА)...' },
  searchingProgress: { en: 'LOADING_DATABASE_RESULTS...', ru: 'ЗАГРУЗКА_РЕЗУЛЬТАТОВ_ПОИСКА...' },
  searchError: { en: '[SEARCH_CONNECTION_ERROR]', ru: '[ОШИБКА_ПОИСКА_ИЛИ_СОЕДИНЕНИЯ]' },
  searchIdle: { en: '[QUERY_DATABASE_IDLE]', ru: '[БАЗА_ДАННЫХ_ОЖИДАЕТ_ЗАПРОС]' },
  searchIdleSub: { en: 'Input show/movie search strings. CineShelf imports poster covers, IMDb stats, plots and castings from public indexes.', ru: 'Введите название фильма. Кинополка автоматически импортирует обложки, рейтинги IMDb, описания сюжета и актеров из открытых баз.' },
  inLibraryBadge: { en: 'IN LIBRARY', ru: 'В БИБЛИОТЕКЕ' },
  importingProgress: { en: '[IMPORTING...]', ru: '[ИМПОРТ...]' },
  addWatchedTitle: { en: 'ADD AS WATCHED', ru: 'ДОБАВИТЬ В ПРОСМОТРЕННЫЕ' },
  addWatchingTitle: { en: 'ADD AS WATCHING', ru: 'ДОБАВИТЬ В ПРОЦЕСС' },
  addWatchlistTitle: { en: 'ADD TO WATCHLIST', ru: 'ДОБАВИТЬ В ПЛАНЫ' },

  // Dashboard Stats
  statsCataloged: { en: 'TOTAL CATALOGED', ru: 'ВСЕГО В КАТАЛОГЕ' },
  statsActive: { en: 'ACTV', ru: 'СМОТРЮ' },
  statsPlan: { en: 'PLAN', ru: 'В ПЛАНАХ' },
  statsScreenTime: { en: 'SCREEN TIME', ru: 'ВРЕМЯ ПРОСМОТРА' },
  statsHours: { en: 'HRS', ru: 'ЧАС.' },
  statsAcross: { en: 'ACROSS', ru: 'ДЛЯ' },
  statsFilms: { en: 'FILMS', ru: 'ФИЛЬМОВ' },
  statsAvgRating: { en: 'AVG RATING', ru: 'СРЕДНЯЯ ОЦЕНКА' },
  statsFromRated: { en: 'FROM', ru: 'ДЛЯ' },
  statsRatedOnly: { en: 'RATED', ru: 'ОЦЕНЕННЫХ' },
  statsUserReviews: { en: 'USER REVIEWS', ru: 'НАПИСАНО РЕЦЕНЗИЙ' },
  statsAndFavorites: { en: '&', ru: 'И' },
  statsFavorites: { en: 'FAVORITES', ru: 'ИЗБРАННЫХ' },
  statsDistribution: { en: 'GENRE DISTRIBUTION', ru: 'РАСПРЕДЕЛЕНИЕ ПО ЖАНРАМ' },
  statsNoMetrics: { en: '[NO_STATISTICAL_METRICS_FOUND]', ru: '[НЕТ_СТАТИСТИЧЕСКИХ_ДАННЫХ]' },
  statsBreakdown: { en: 'LIBRARY BREAKDOWN', ru: 'СТРУКТУРА БИБЛИОТЕКИ' },
  statsLevelLabel: { en: 'CRITIC STATUS', ru: 'СТАТУС КИНОКРИТИКА' },
  statsLevelHistorian: { en: '[🎬 HISTORIAN]', ru: '[🎬 КИНОИСТОРИК]' },
  statsLevelCritic: { en: '[🍿 SENIOR_CRITIC]', ru: '[🍿 КИНОКРИТИК]' },
  statsLevelSpectator: { en: '[🎟️ SPECTATOR]', ru: '[🎟️ ЗРИТЕЛЬ]' },
  statsLevelInitiate: { en: '[🌱 INITIATE]', ru: '[🌱 НОВИЧОК]' },

  // Settings Panel
  settingsHeading: { en: 'SEARCH ENGINE ROUTING', ru: 'МАРШРУТИЗАЦИЯ ПОИСКА' },
  settingsLangLabel: { en: 'APPLICATION LANGUAGE', ru: 'ЯЗЫК ИНТЕРФЕЙСА' },
  settingsActiveSelector: { en: 'ACTIVE ENGINES SELECTOR (CHOOSE MULTIPLE)', ru: 'АКТИВНЫЕ ПОИСКОВЫЕ ДВИЖКИ (ВЫБЕРИТЕ НЕСКОЛЬКО)' },
  searchEnginesLabel: { en: 'DATABASES:', ru: 'БАЗЫ ДАННЫХ:' },
  apiKeyRequired: { en: 'API Key Required in Settings', ru: 'Требуется API-ключ в настройках' },
  tvmazeDesc: { en: 'Public API. Ideal for importing popular TV series, miniseries and basic shows out-of-the-box.', ru: 'Публичный API. Отлично подходит для импорта сериалов и популярных фильмов без регистрации.' },
  tmdbDesc: { en: 'Premium film directory. Feeds high-quality plot descriptions, actors profiles, and custom stencils.', ru: 'Премиум каталог фильмов. Предоставляет качественные описания, списки актеров и оригинальные обложки.' },
  omdbDesc: { en: 'IMDb proxy system. Highly accurate for logging absolute runtimes, release dates, and critical reviews.', ru: 'Система IMDb-прокси. Идеально для импорта точной длительности, дат релиза и оценок IMDb.' },
  settingsApiKeyLabel: { en: 'API KEY CREDENTIALS', ru: 'КЛЮЧ ДОСТУПА API' },
  tmdbKeySub: { en: 'Sign up on themoviedb.org to retrieve a free v3 credentials key.', ru: 'Зарегистрируйтесь на themoviedb.org, чтобы бесплатно получить v3 API-ключ.' },
  omdbKeySub: { en: 'Get keys on omdbapi.com. Standard tier accommodates 1k daily lookups.', ru: 'Получите ключ на omdbapi.com. Бесплатный тариф дает до 1000 запросов в день.' },
  saveSuccessText: { en: '[SETTINGS_SAVED_SUCCESSFULLY]', ru: '[НАСТРОЙКИ_УСПЕШНО_СОХРАНЕНЫ]' },
  saveConfigBtn: { en: 'SAVE CONFIGURATION', ru: 'СОХРАНИТЬ НАСТРОЙКИ' },
  
  // Database backup settings
  dbUtilitiesLabel: { en: 'DATABASE UTILITIES', ru: 'УТИЛИТЫ БАЗЫ ДАННЫХ' },
  dbBackupDesc: { en: 'CineShelf runs as a local-first application. Export catalogs periodically to retain backups or load logs on external devices.', ru: 'Кинополка работает локально в браузере. Периодически экспортируйте каталог, чтобы сохранить резервные копии или перенести данные.' },
  dbExportBtn: { en: 'EXPORT DATABASE (JSON)', ru: 'ЭКСПОРТ БАЗЫ (JSON)' },
  dbExportSub: { en: 'DOWNLOAD RECORDS.', ru: 'СКАЧАТЬ ВСЕ ЗАПИСИ.' },
  dbImportBtn: { en: 'IMPORT DATABASE (JSON)', ru: 'ИМПОРТ БАЗЫ (JSON)' },
  dbImportSub: { en: 'UPLOAD BACKUP LOG TO LOCAL QUEUE.', ru: 'ЗАГРУЗИТЬ БЭКАП И ОБЪЕДИНИТЬ.' },
  dbImportSuccess: { en: '[DATABASE_RESTORED_AND_MERGED_SUCCESSFULLY]', ru: '[БАЗА_ДАННЫХ_УСПЕШНО_ВОССТАНОВЛЕНА_И_ОБЪЕДИНЕНА]' },
  dbImportError: { en: '[IMPORT_ERROR]', ru: '[ОШИБКА_ИМПОРТА]' },

  // System Utilities Danger Zone
  systemUtilitiesLabel: { en: 'SYSTEM UTILITIES', ru: 'СИСТЕМНЫЕ СЛУЖБЫ' },
  preloadSeedLabel: { en: 'SEED WELCOME PACK', ru: 'ЗАГРУЗИТЬ СТАРТОВЫЙ ДЕМО-ПАК' },
  preloadSeedSub: { en: 'populate an empty cache with **10 classic movie entries** complete with mock rating tags, watch dates and reviews to test out filters.', ru: 'заполнить пустую базу **10 классическими киношедеврами** с демо-отзывами, оценками и тегами для проверки работы фильтров.' },
  preloadSeedBtn: { en: 'RUN SEED PACK', ru: 'ЗАПУСТИТЬ ДЕМО-ПАК' },
  preloadSeedConfirm: { en: 'This will load 10 curated films (Interstellar, Inception, Dune, etc.) into your library with mock reviews. Proceed?', ru: 'Это загрузит 10 избранных фильмов (Интерстеллар, Начало, Дюна и др.) в вашу библиотеку с демо-отзывами. Продолжить?' },
  factoryResetLabel: { en: 'FACTORY RESET SYSTEM', ru: 'СБРОС ДО ЗАВОДСКИХ НАСТРОЕК' },
  factoryResetSub: { en: 'permanently erase logged movie entries, saved configs and restore browser local cineshelf storage to factory clean.', ru: 'навсегда стереть все записи о фильмах, сохраненные ключи и сбросить локальный кэш приложения.' },
  factoryResetBtn: { en: 'WIPE CACHE', ru: 'ОЧИСТИТЬ КЭШ' },
  factoryResetConfirm: { en: 'WARNING: THIS IS IRREVERSIBLE! Are you absolutely sure you want to delete your entire movie database library?', ru: 'ВНИМАНИЕ: ЭТО НЕОБРАТИМО! Вы абсолютно уверены, что хотите полностью стереть библиотеку фильмов?' },
  mergeConfirm: { en: 'Would you like to completely replace your current database? Click OK to overwrite, or Cancel to merge imported movies into your existing library.', ru: 'Хотите полностью перезаписать текущую базу данных? Нажмите ОК для замены, или Отмена для слияния импортированных фильмов с вашим каталогом.' },
  doubleAddWarning: { en: 'is already in your library.', ru: 'уже добавлено в вашу библиотеку.' },

  // Series Tracker Keys
  seasonsCount: { en: 'SEASONS', ru: 'СЕЗОНОВ' },
  episodesCount: { en: 'EPISODES', ru: 'СЕРИЙ' },
  seriesTrackerTitle: { en: 'SEASONS & EPISODES RATING', ru: 'ОЦЕНКИ СЕЗОНОВ И СЕРИЙ' },
  activeSeasonLabel: { en: 'ACTIVE SEASON', ru: 'АКТИВНЫЙ СЕЗОН' },
  ratingEpisodeText: { en: 'RATE EPISODE', ru: 'ОЦЕНИТЬ СЕРИЮ' },
  clearRatingBtn: { en: 'CLEAR RATING', ru: 'СБРОСИТЬ ОЦЕНКУ' },

  // DVD Case Specific Keys
  viewGrid: { en: 'GRID VIEW', ru: 'СЕТКА' },
  viewDvd: { en: 'DVD SHELF', ru: 'ПОЛКА DVD' },
  dvdCoverBackBooklet: { en: 'FILM ARCHIVE BOOKLET', ru: 'АРХИВНЫЙ БУКЛЕТ ФИЛЬМА' },
  dvdTabReview: { en: '[REVIEW]', ru: '[ОТЗЫВ]' },
  dvdTabCritique: { en: '[CRITIQUE]', ru: '[МНЕНИЕ]' },
  dvdTabEpisodes: { en: '[EPISODES]', ru: '[СЕРИИ]' }
};

// Helper function to resolve localized keys
export const t = (key: string, lang: Language): string => {
  if (translations[key]) {
    return translations[key][lang];
  }
  return key;
};
