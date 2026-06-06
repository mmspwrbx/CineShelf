import React, { useState, useRef } from 'react';
import type { ApiSettings, LibraryMovie } from '../types';
import { storage } from '../services/storage';
import { CURATED_LOCAL_MOVIES } from '../services/movieApi';
import { Settings, Key, Download, Upload, Trash2, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import { t } from '../services/translations';
import type { Language } from '../services/translations';

interface SettingsPanelProps {
  settings: ApiSettings;
  onSaveSettings: (settings: ApiSettings) => void;
  movies: LibraryMovie[];
  onImportMovies: (movies: LibraryMovie[]) => void;
  onResetLibrary: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSaveSettings,
  movies,
  onImportMovies,
  onResetLibrary,
}) => {
  const [tmdbKey, setTmdbKey] = useState(settings.tmdbApiKey);
  const [omdbKey, setOmdbKey] = useState(settings.omdbApiKey);
  const [activeEngines, setActiveEngines] = useState<('tvmaze' | 'tmdb' | 'omdb')[]>(
    settings.activeEngines || [settings.activeEngine || 'tvmaze']
  );
  const [language, setLanguage] = useState<Language>(settings.language || 'en');

  const handleToggleEngine = (engine: 'tvmaze' | 'tmdb' | 'omdb') => {
    setActiveEngines((prev) => {
      if (prev.includes(engine)) {
        if (prev.length === 1) return prev; // Enforce at least one active engine
        return prev.filter((e) => e !== engine);
      } else {
        return [...prev, engine];
      }
    });
  };
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      tmdbApiKey: tmdbKey.trim(),
      omdbApiKey: omdbKey.trim(),
      activeEngine: activeEngines[0] || 'tvmaze',
      activeEngines,
      language,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExport = () => {
    const jsonString = storage.exportLibrary(movies);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `cineshelf_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const imported = storage.importLibrary(text);
        onImportMovies(imported);
        setImportSuccess(true);
        setImportError('');
        setTimeout(() => setImportSuccess(false), 3000);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePreloadWelcomePack = () => {
    if (confirm(t('preloadSeedConfirm', language))) {
      const welcomeMovies: LibraryMovie[] = CURATED_LOCAL_MOVIES.map((meta, idx) => ({
        id: meta.id,
        metadata: meta,
        review: {
          rating: idx === 0 ? 10 : idx === 3 ? 9 : 8,
          reviewText: `This is a preloaded critique of ${meta.title}. A stunning cinematic achievement with a strong performance from the lead cast. Truly a masterpiece!`,
          watchDate: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          watchCount: 1,
          favorite: idx < 3,
          notes: 'Added via Welcome Pack pre-loads.'
        },
        status: idx === 8 ? 'watching' : idx === 9 ? 'plan-to-watch' : 'watched',
        tags: meta.genre.map(g => g.toLowerCase())
      }));

      onImportMovies(welcomeMovies);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in pb-12">
      
      {/* Configuration panel */}
      <form onSubmit={handleSaveConfig} className="stark-panel p-6 rounded-none bg-black space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
          <Settings className="h-4 w-4 text-white" />
          <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-white">{t('settingsHeading', language)}</h3>
        </div>

        {/* Language Selector */}
        <div className="space-y-3">
          <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-bold block">
            {t('settingsLangLabel', language)}
          </label>
          <div className="relative w-full sm:w-72">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="stark-input px-4 py-3 rounded-none text-xs w-full font-mono cursor-pointer uppercase"
            >
              <option value="en">English (EN)</option>
              <option value="ru">Русский (RU)</option>
            </select>
          </div>
        </div>

        {/* Engine Toggle Cards */}
        <div className="space-y-3 border-t border-white/10 pt-4">
          <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-bold block">{t('settingsActiveSelector', language)}</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                   {/* TVMaze */}
            <div
              onClick={() => handleToggleEngine('tvmaze')}
              className={`p-4 rounded-none border cursor-pointer transition-all ${
                activeEngines.includes('tvmaze')
                  ? 'border-white bg-white text-black'
                  : 'border-white/15 bg-black hover:bg-white/5 text-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono uppercase font-bold ${activeEngines.includes('tvmaze') ? 'text-black' : 'text-white'}`}>TVMAZE</span>
                <span className={`text-[8px] px-1.5 py-0.2 rounded-none font-mono font-bold uppercase tracking-wider border ${
                  activeEngines.includes('tvmaze') ? 'border-black bg-black text-white' : 'border-white/20 bg-transparent text-gray-400'
                }`}>
                  KEYLESS
                </span>
              </div>
              <p className={`text-[9px] font-mono mt-2 leading-relaxed ${activeEngines.includes('tvmaze') ? 'text-neutral-800' : 'text-gray-500'}`}>
                {t('tvmazeDesc', language)}
              </p>
            </div>

            {/* TMDB */}
            <div
              onClick={() => handleToggleEngine('tmdb')}
              className={`p-4 rounded-none border cursor-pointer transition-all ${
                activeEngines.includes('tmdb')
                  ? 'border-white bg-white text-black'
                  : 'border-white/15 bg-black hover:bg-white/5 text-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono uppercase font-bold ${activeEngines.includes('tmdb') ? 'text-black' : 'text-white'}`}>TMDB (V3)</span>
                <span className={`text-[8px] px-1.5 py-0.2 rounded-none font-mono font-bold uppercase tracking-wider border ${
                  activeEngines.includes('tmdb') ? 'border-black bg-black text-white' : 'border-white/20 bg-transparent text-gray-400'
                }`}>
                  API KEY
                </span>
              </div>
              <p className={`text-[9px] font-mono mt-2 leading-relaxed ${activeEngines.includes('tmdb') ? 'text-neutral-800' : 'text-gray-500'}`}>
                {t('tmdbDesc', language)}
              </p>
            </div>

            {/* OMDb */}
            <div
              onClick={() => handleToggleEngine('omdb')}
              className={`p-4 rounded-none border cursor-pointer transition-all ${
                activeEngines.includes('omdb')
                  ? 'border-white bg-white text-black'
                  : 'border-white/15 bg-black hover:bg-white/5 text-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono uppercase font-bold ${activeEngines.includes('omdb') ? 'text-black' : 'text-white'}`}>OMDB API</span>
                <span className={`text-[8px] px-1.5 py-0.2 rounded-none font-mono font-bold uppercase tracking-wider border ${
                  activeEngines.includes('omdb') ? 'border-black bg-black text-white' : 'border-white/20 bg-transparent text-gray-400'
                }`}>
                  API KEY
                </span>
              </div>
              <p className={`text-[9px] font-mono mt-2 leading-relaxed ${activeEngines.includes('omdb') ? 'text-neutral-800' : 'text-gray-500'}`}>
                {t('omdbDesc', language)}
              </p>
            </div>
          </div>
        </div>

        {/* API keys fields */}
        {(activeEngines.includes('tmdb') || activeEngines.includes('omdb')) && (
          <div className="space-y-4 border-t border-white/10 pt-4 animate-fade-in">
            {activeEngines.includes('tmdb') && (
              <div className="space-y-1.5 animate-fade-in">
                <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-bold block flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-white" />
                  {t('settingsApiKeyLabel', language)} (TMDB)
                </label>
                <input
                  type="password"
                  placeholder="INPUT TMDB KEY..."
                  value={tmdbKey}
                  onChange={(e) => setTmdbKey(e.target.value)}
                  className="stark-input px-4 py-2.5 rounded-none text-xs w-full font-mono"
                />
                <span className="text-[9px] text-gray-500 block leading-relaxed font-mono">
                  {t('tmdbKeySub', language)}
                </span>
              </div>
            )}

            {activeEngines.includes('omdb') && (
              <div className="space-y-1.5 animate-fade-in">
                <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-bold block flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-white" />
                  {t('settingsApiKeyLabel', language)} (OMDB)
                </label>
                <input
                  type="password"
                  placeholder="INPUT OMDB KEY..."
                  value={omdbKey}
                  onChange={(e) => setOmdbKey(e.target.value)}
                  className="stark-input px-4 py-2.5 rounded-none text-xs w-full font-mono"
                />
                <span className="text-[9px] text-gray-500 block leading-relaxed font-mono">
                  {t('omdbKeySub', language)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          {saveSuccess ? (
            <div className="flex items-center gap-1.5 text-xs text-white font-bold font-mono">
              <CheckCircle2 className="h-4 w-4" />
              {t('saveSuccessText', language)}
            </div>
          ) : (
            <span className="text-[9px] text-gray-500 font-mono">
              [STORAGE: CONFIG_LOCAL_SYNC_OK]
            </span>
          )}

          <button
            type="submit"
            className="stark-btn px-6 py-2.5 font-bold rounded-none text-xs font-mono uppercase tracking-wider cursor-pointer"
          >
            {t('saveConfigBtn', language)}
          </button>
        </div>
      </form>

      {/* Database utilities */}
      <div className="stark-panel p-6 rounded-none bg-black space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
          <Download className="h-4 w-4 text-white" />
          <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-white">{t('dbUtilitiesLabel', language)}</h3>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed font-sans">
          {t('dbBackupDesc', language)}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export */}
          <button
            onClick={handleExport}
            disabled={movies.length === 0}
            className="flex items-center justify-center gap-4 p-5 rounded-none border border-white/10 bg-black hover:bg-white hover:text-black active:scale-98 transition-all group disabled:opacity-50 disabled:cursor-not-allowed text-left cursor-pointer"
          >
            <Download className="h-5 w-5 text-white group-hover:text-black" />
            <div>
              <span className="text-xs font-bold font-mono uppercase block text-white group-hover:text-black">{t('dbExportBtn', language)}</span>
              <span className="text-[9px] text-gray-500 block mt-0.5 font-mono group-hover:text-neutral-700">
                {t('dbExportSub', language)} [{movies.length}]
              </span>
            </div>
          </button>

          {/* Import */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-4 p-5 rounded-none border border-white/10 bg-black hover:bg-white hover:text-black active:scale-98 transition-all group cursor-pointer"
          >
            <Upload className="h-5 w-5 text-white group-hover:text-black" />
            <div>
              <span className="text-xs font-bold font-mono uppercase block text-white group-hover:text-black">{t('dbImportBtn', language)}</span>
              <span className="text-[9px] text-gray-500 block mt-0.5 font-mono group-hover:text-neutral-700">
                {t('dbImportSub', language)}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>
        </div>

        {importSuccess && (
          <div className="flex items-center gap-2 border border-white text-white p-3.5 rounded-none text-xs font-mono uppercase font-bold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {t('dbImportSuccess', language)}
          </div>
        )}

        {importError && (
          <div className="flex items-center gap-2 border border-rose-500/30 bg-rose-500/5 text-rose-400 p-3.5 rounded-none text-xs font-mono uppercase">
            <AlertTriangle className="h-4 w-4 shrink-0 animate-pulse" />
            <span>{t('dbImportError', language)}: {importError}</span>
          </div>
        )}
      </div>

      {/* Danger Zone / Preloads */}
      <div className="stark-panel p-6 rounded-none bg-black space-y-5 border border-white/20">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
          <AlertTriangle className="h-4 w-4 text-white" />
          <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-white">{t('systemUtilitiesLabel', language)}</h3>
        </div>

        {/* Preload seed */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between text-xs font-mono uppercase text-gray-400">
          <div>
            <p className="font-bold text-white mb-0.5">{t('preloadSeedLabel', language)}</p>
            <p className="text-[9px] text-gray-500 leading-relaxed max-w-md font-mono lowercase">
              {t('preloadSeedSub', language)}
            </p>
          </div>
          <button
            type="button"
            onClick={handlePreloadWelcomePack}
            className="flex items-center gap-1.5 px-4 py-2.5 stark-btn text-white rounded-none font-bold uppercase text-[10px] tracking-wider transition-all shrink-0 cursor-pointer"
          >
            <Play className="h-3.5 w-3.5" />
            {t('preloadSeedBtn', language)}
          </button>
        </div>

        {/* Factory Reset */}
        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs font-mono uppercase text-gray-400">
          <div>
            <p className="font-bold text-white mb-0.5">{t('factoryResetLabel', language)}</p>
            <p className="text-[9px] text-gray-500 leading-relaxed max-w-md font-mono lowercase">
              {t('factoryResetSub', language)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm(t('factoryResetConfirm', language))) {
                onResetLibrary();
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 stark-btn-danger rounded-none font-bold uppercase text-[10px] tracking-wider transition-all shrink-0 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t('factoryResetBtn', language)}
          </button>
        </div>
      </div>
    </div>
  );
};
