// .gitignore Generator
(function () {
  'use strict';

  const TEMPLATES = {
    Languages: {
      'JavaScript': `node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
package-lock.json.bak
*.tsbuildinfo
.npm/
.yarn/
.pnp.*`,
      'TypeScript': `*.tsbuildinfo
dist/
build/
*.js.map
*.d.ts.map`,
      'Python': `__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
.pytest_cache/
.mypy_cache/
.coverage
.coverage.*
htmlcov/
.tox/
.venv/
venv/
ENV/
env/`,
      'Go': `*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
go.work
go.work.sum
vendor/`,
      'Rust': `target/
Cargo.lock
**/*.rs.bk
*.pdb`,
      'Java': `*.class
*.log
*.ctxt
.mtj.tmp/
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar
hs_err_pid*
replay_pid*`,
      'Ruby': `*.gem
*.rbc
/.config
/coverage/
/InstalledFiles
/pkg/
/spec/reports/
/spec/examples.txt
/test/tmp/
/test/version_tmp/
/tmp/
.byebug_history
.bundle/
vendor/bundle
lib/bundler/man/
.rvmrc`,
      'PHP': `/vendor/
composer.phar
composer.lock
.phpunit.result.cache
.phpunit.cache/
.php_cs.cache
.php-cs-fixer.cache`,
      'C/C++': `*.o
*.ko
*.obj
*.elf
*.ilk
*.map
*.exp
*.gch
*.pch
*.lib
*.a
*.la
*.lo
*.dll
*.so
*.so.*
*.dylib
*.exe
*.out
*.app
*.i*86
*.x86_64
*.hex
*.dSYM/
*.su
*.idb
*.pdb`,
      'Swift': `build/
DerivedData/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata/
*.moved-aside
*.xccheckout
*.xcscmblueprint
*.hmap
*.ipa
*.dSYM.zip
*.dSYM
Pods/
Carthage/Build/
.swiftpm/
Package.resolved`,
      'Kotlin': `*.class
.gradle/
build/
!gradle-wrapper.jar
!**/src/main/**/build/
!**/src/test/**/build/
local.properties
.kotlin/`,
      'Dart': `.dart_tool/
.packages
build/
pubspec.lock
doc/api/
.flutter-plugins
.flutter-plugins-dependencies`
    },
    Frameworks: {
      'Node': `node_modules/
.env
.env.local
.env.*.local
dist/
coverage/
*.log
.DS_Store
.cache/`,
      'React': `build/
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*`,
      'Next.js': `.next/
out/
next-env.d.ts
.vercel
*.tsbuildinfo`,
      'Vue': `dist/
node_modules/
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*`,
      'Nuxt': `.nuxt/
.output/
.nitro/
dist/
.env`,
      'Angular': `/dist/
/tmp/
/out-tsc/
/bazel-out
.angular/cache
/connect.lock
/coverage
/libpeerconnection.log
testem.log
/typings`,
      'Django': `*.log
*.pot
*.pyc
__pycache__/
local_settings.py
db.sqlite3
db.sqlite3-journal
media/
staticfiles/`,
      'Flask': `instance/
.webassets-cache
.flaskenv`,
      'Rails': `*.rbc
capybara-*.html
.rspec
/db/*.sqlite3
/db/*.sqlite3-journal
/public/system
/coverage/
/spec/tmp
**.orig
rerun.txt
pickle-email-*.html
config/initializers/secret_token.rb
config/master.key
/public/assets
/tmp/*
!/tmp/.keep
/log/*
!/log/.keep
/storage/*
!/storage/.keep`,
      'Laravel': `/node_modules
/public/build
/public/hot
/public/storage
/storage/*.key
/vendor
.env
.env.backup
.env.production
.phpunit.result.cache
Homestead.json
Homestead.yaml
auth.json
npm-debug.log
yarn-error.log
/.fleet
/.idea
/.vscode`,
      'Spring': `HELP.md
target/
!.mvn/wrapper/maven-wrapper.jar
!**/src/main/**/target/
!**/src/test/**/target/
.gradle
build/
!gradle/wrapper/gradle-wrapper.jar
!**/src/main/**/build/
!**/src/test/**/build/`,
      'Flutter': `**/doc/api/
**/ios/Flutter/.last_build_id
.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
.packages
build/`,
      'React Native': `ios/Pods/
android/app/build/
android/build/
.expo/
.expo-shared/
dist/
web-build/`
    },
    'Build tools': {
      'Webpack': `.webpack/
webpack-stats.json`,
      'Vite': `dist/
dist-ssr/
*.local
.vite/`,
      'Gradle': `.gradle/
build/
!gradle/wrapper/gradle-wrapper.jar
!**/src/main/**/build/
!**/src/test/**/build/
gradle-app.setting
.gradletasknamecache`,
      'Maven': `target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties
dependency-reduced-pom.xml
buildNumber.properties
.mvn/timing.properties
.mvn/wrapper/maven-wrapper.jar`
    },
    IDEs: {
      'VSCode': `.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.code-workspace
.history/`,
      'JetBrains': `.idea/
*.iml
*.iws
*.ipr
out/
.idea_modules/
atlassian-ide-plugin.xml
cmake-build-*/
.fleet/`,
      'Vim': `*.swp
*.swo
*.swn
*~
.netrwhist
Session.vim
Sessionx.vim
.vim/
tags`,
      'Emacs': `*~
\\#*\\#
/.emacs.desktop
/.emacs.desktop.lock
*.elc
auto-save-list
tramp
.\\#*
.org-id-locations
*_archive
*_flymake.*
.projectile
.dir-locals.el
.cask/`,
      'Sublime': `*.tmlanguage.cache
*.tmPreferences.cache
*.stTheme.cache
*.sublime-workspace
*.sublime-project
sftp-config.json
sftp-config-alt*.json
Package Control.last-run
Package Control.ca-list
Package Control.ca-bundle
Package Control.system-ca-bundle
Package Control.cache/
Package Control.ca-certs/
Package Control.merged-ca-bundle
Package Control.user-ca-bundle
oscrypto-ca-bundle.crt
bh_unicode_properties.cache
GitHub.sublime-settings`,
      'Eclipse': `.metadata
bin/
tmp/
*.tmp
*.bak
*.swp
*~.nib
local.properties
.settings/
.loadpath
.recommenders
.project
.classpath
.factorypath
.buildpath
.target
.springBeans
.sts4-cache
.apt_generated
.apt_generated_test
.cproject
.autotools`
    },
    OS: {
      'macOS': `.DS_Store
.AppleDouble
.LSOverride
Icon
._*
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent
.AppleDB
.AppleDesktop
Network Trash Folder
Temporary Items
.apdisk`,
      'Windows': `Thumbs.db
Thumbs.db:encryptable
ehthumbs.db
ehthumbs_vista.db
*.stackdump
[Dd]esktop.ini
$RECYCLE.BIN/
*.cab
*.msi
*.msix
*.msm
*.msp
*.lnk`,
      'Linux': `*~
.fuse_hidden*
.directory
.Trash-*
.nfs*`
    }
  };

  const selected = new Set();
  const chipsRow = document.getElementById('chips-row');
  const catsEl = document.getElementById('cats');
  const searchEl = document.getElementById('search');
  const outputEl = document.getElementById('output');
  const statsEl = document.getElementById('stats');

  function renderCats(filter) {
    const f = (filter || '').trim().toLowerCase();
    catsEl.innerHTML = '';
    for (const cat of Object.keys(TEMPLATES)) {
      const items = Object.keys(TEMPLATES[cat]).filter(n => !f || n.toLowerCase().includes(f));
      if (!items.length) continue;
      const catEl = document.createElement('div');
      catEl.className = 'cat';
      const h3 = document.createElement('h3');
      h3.textContent = cat;
      catEl.appendChild(h3);
      const list = document.createElement('div');
      list.className = 'cat-items';
      for (const name of items) {
        const row = document.createElement('label');
        row.className = 'item' + (selected.has(name) ? ' selected' : '');
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = selected.has(name);
        cb.addEventListener('change', () => { toggle(name); });
        row.appendChild(cb);
        const span = document.createElement('span');
        span.textContent = name;
        row.appendChild(span);
        list.appendChild(row);
      }
      catEl.appendChild(list);
      catsEl.appendChild(catEl);
    }
  }

  function toggle(name) {
    if (selected.has(name)) selected.delete(name);
    else selected.add(name);
    renderChips();
    renderCats(searchEl.value);
    renderOutput();
  }

  function renderChips() {
    chipsRow.innerHTML = '';
    if (selected.size === 0) {
      const p = document.createElement('span');
      p.className = 'chips-placeholder';
      p.textContent = 'No templates selected. Pick from below.';
      chipsRow.appendChild(p);
      return;
    }
    for (const name of selected) {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.innerHTML = name + ' <span class="x">&times;</span>';
      chip.addEventListener('click', () => { toggle(name); });
      chipsRow.appendChild(chip);
    }
  }

  function findTemplate(name) {
    for (const cat of Object.keys(TEMPLATES)) {
      if (name in TEMPLATES[cat]) return TEMPLATES[cat][name];
    }
    return '';
  }

  function renderOutput() {
    if (selected.size === 0) {
      outputEl.value = '';
      statsEl.textContent = '0 selected \u00b7 0 lines';
      return;
    }
    const seen = new Set();
    const parts = [];
    for (const name of selected) {
      const body = findTemplate(name);
      parts.push('# === ' + name + ' ===');
      for (const line of body.split('\n')) {
        const t = line;
        if (t === '' || t.startsWith('#') || !seen.has(t)) {
          parts.push(t);
          if (t !== '' && !t.startsWith('#')) seen.add(t);
        }
      }
      parts.push('');
    }
    outputEl.value = parts.join('\n').replace(/\n+$/, '\n');
    statsEl.textContent = selected.size + ' selected \u00b7 ' + outputEl.value.split('\n').length + ' lines';
  }

  searchEl.addEventListener('input', () => renderCats(searchEl.value));
  document.getElementById('btn-copy').addEventListener('click', () => {
    if (!outputEl.value) return;
    navigator.clipboard.writeText(outputEl.value);
  });
  document.getElementById('btn-dl').addEventListener('click', () => {
    if (!outputEl.value) return;
    const blob = new Blob([outputEl.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = '.gitignore';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // defaults
  selected.add('Node');
  selected.add('macOS');
  selected.add('VSCode');
  renderChips();
  renderCats('');
  renderOutput();
})();
