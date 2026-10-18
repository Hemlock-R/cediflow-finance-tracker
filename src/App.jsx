import { useState } from "react";

const switchTab = window.switchTab;

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-title-block">
            <h1 className="app-title">CediFlow</h1>
            <p className="app-tagline">
              Financial Health &amp; Wealth Tracking Suite
            </p>
          </div>
        </div>
      </header>

      <div className="navigation-tabs">
        <img
          src="/cediflow-logo.png"
          alt="CediFlow logo"
          className="nav-logo"
        />

        <button
          className="nav-tab active"
          onClick={(event) => switchTab("dashboardView", event.currentTarget)}
        >
          Metrics Dashboard
        </button>

        <button
          className="nav-tab"
          onClick={(event) => switchTab("successView", event.currentTarget)}
        >
          Success &amp; Goals
        </button>

        <button
          className="nav-tab"
          onClick={(event) => switchTab("calcView", event.currentTarget)}
        >
          Calculator
        </button>

        <button
          className="nav-tab desktop-extra-tab"
          onClick={(event) => switchTab("adminView", event.currentTarget)}
        >
          Settings
        </button>

        <button
          className="nav-tab desktop-extra-tab"
          onClick={(event) => switchTab("helpView", event.currentTarget)}
        >
          Need Help
        </button>

        <button
          className="menu-toggle"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {menuOpen && (
          <>
            <div className="menu-overlay" onClick={() => setMenuOpen(false)} />

            <aside className="side-panel">
              <div className="side-panel-header">
                <h3>More Options</h3>
                <button
                  className="side-panel-close"
                  aria-label="Close navigation menu"
                  onClick={() => setMenuOpen(false)}
                >
                  ×
                </button>
              </div>

              <button
                className="side-panel-link"
                onClick={() => {
                  switchTab("adminView");
                  setMenuOpen(false);
                }}
              >
                Settings
              </button>

              <button
                className="side-panel-link"
                onClick={() => {
                  switchTab("helpView");
                  setMenuOpen(false);
                }}
              >
                Need Help
              </button>

              <button
                className="side-panel-link"
                onClick={() => {
                  switchTab("privacyView");
                  setMenuOpen(false);
                }}
              >
                Privacy Policy
              </button>

              <button
                className="side-panel-link"
                onClick={() => {
                  switchTab("feedbackView");
                  setMenuOpen(false);
                }}
              >
                Feedback
              </button>
            </aside>
          </>
        )}
      </div>

      <div className="dashboard">
        {/* DASHBOARD VIEW */}
        <div id="dashboardView" className="view-panel active">
          <h1>Financial Health and Wealth Dashboard</h1>

          <div className="inputs-grid">
            <div className="input-group">
              <label htmlFor="assets">Total Assets</label>
              <input
                type="number"
                id="assets"
                placeholder="0.00"
                min="0"
                step="0.01"
                onChange={() => window.calculateAndCompare()}
              />
            </div>

            <div className="input-group">
              <label htmlFor="liabilities">Total Liabilities</label>
              <input
                type="number"
                id="liabilities"
                placeholder="0.00"
                min="0"
                step="0.01"
                onChange={() => window.calculateAndCompare()}
              />
            </div>

            <div className="input-group">
              <label htmlFor="income">Total Income</label>
              <input
                type="number"
                id="income"
                placeholder="0.00"
                min="0"
                step="0.01"
                onChange={() => window.calculateAndCompare()}
              />
            </div>

            <div className="input-group">
              <label htmlFor="expenses">Total Expenses</label>
              <input
                type="number"
                id="expenses"
                placeholder="0.00"
                min="0"
                step="0.01"
                onChange={() => window.calculateAndCompare()}
              />
            </div>
          </div>

          <div
            className="inputs-grid"
            style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: "0.75rem",
            }}
          >
            <div className="input-group">
              <label htmlFor="savedMoney">Money Saved</label>
              <input
                type="number"
                id="savedMoney"
                placeholder="0.00"
                min="0"
                step="0.01"
                onChange={() => window.calculateAndCompare()}
              />
            </div>
          </div>

          <div>
            <div className="classifier-grid">
              <div className="input-group">
                <label id="smartLabel" htmlFor="smartItem">
                  Smart Classifier Input
                </label>

                <input
                  type="text"
                  id="smartItem"
                  placeholder="e.g., job payout"
                />
              </div>

              <div className="input-group">
                <label htmlFor="smartAmount">Amount</label>
                <input
                  type="number"
                  id="smartAmount"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <button
                className="btn-save btn-classify"
                onClick={() => window.classifyItem()}
              >
                Classify and Add
              </button>
            </div>

            <div
              id="classificationResult"
              style={{
                marginTop: "0.5rem",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "0.85rem",
                minHeight: "20px",
                padding: "0.4rem",
                borderRadius: "6px",
              }}
            ></div>
          </div>

          <div className="action-container">
            <div className="input-group">
              <label htmlFor="logDate">Select Progress Date</label>
              <input
                type="date"
                id="logDate"
                defaultValue={(() => {
                  const now = new Date();
                  return (
                    now.getFullYear() +
                    "-" +
                    String(now.getMonth() + 1).padStart(2, "0") +
                    "-" +
                    String(now.getDate()).padStart(2, "0")
                  );
                })()}
              />
            </div>

            <button
              className="btn-save"
              onClick={() => window.saveCurrentDay()}
            >
              Log Entry for Selected Date
            </button>
          </div>

          <div className="visualization-layout">
            <div className="comp-box">
              <div className="comp-header">Global Distribution Bar</div>

              <div className="visual-bar-container">
                <div className="bar-segment" id="barAsset"></div>
                <div className="bar-segment" id="barSavings"></div>
                <div className="bar-segment" id="barIncome"></div>
                <div className="bar-segment" id="barExpense"></div>
                <div className="bar-segment" id="barLiability"></div>
              </div>

              <div className="legend-grid">
                <div className="legend-item">
                  <span className="dot dot-asset"></span>
                  <span className="legend-label">Assets</span>
                  <span className="legend-value" id="pctAsset">
                    25%
                  </span>
                </div>
                <div className="legend-item">
                  <span className="dot dot-savings"></span>
                  <span className="legend-label">Savings</span>
                  <span className="legend-value" id="pctSavings">
                    20%
                  </span>
                </div>
                <div className="legend-item">
                  <span className="dot dot-income"></span>
                  <span className="legend-label">Income</span>
                  <span className="legend-value" id="pctIncome">
                    25%
                  </span>
                </div>
                <div className="legend-item">
                  <span className="dot dot-expense"></span>
                  <span className="legend-label">Expenses</span>
                  <span className="legend-value" id="pctExpense">
                    25%
                  </span>
                </div>
                <div className="legend-item">
                  <span className="dot dot-liability"></span>
                  <span className="legend-label">Liabilities</span>
                  <span className="legend-value" id="pctLiability">
                    25%
                  </span>
                </div>
              </div>
            </div>

            <div className="sketch-table-container">
              <div className="sketch-row sketch-income" id="rowIncome">
                TOTAL INCOME
                <span className="sketch-val" id="sketchIncome">
                  GH₵0.00
                </span>
              </div>

              <div className="sketch-row sketch-expenses" id="rowExpenses">
                TOTAL EXPENSES
                <span className="sketch-val" id="sketchExpenses">
                  GH₵0.00
                </span>
              </div>

              <div className="sketch-split">
                <div className="sketch-col sketch-assets" id="colAssets">
                  TOTAL ASSETS
                  <span className="sketch-val" id="sketchAssets">
                    GH₵0.00
                  </span>
                </div>

                <div
                  className="sketch-col sketch-liabilities"
                  id="colLiabilities"
                >
                  TOTAL LIABILITIES
                  <span className="sketch-val" id="sketchLiabilities">
                    GH₵0.00
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="results-section">
            <div className="result-card">
              <h3
                style={{
                  margin: 0,
                  color: "var(--text-secondary)",
                  fontSize: "0.85rem",
                }}
              >
                Net Worth
              </h3>

              <div className="value" id="netWorthDisplay">
                GH₵0.00
              </div>

              <div className="status" id="netWorthStatus">
                Breakeven
              </div>
            </div>

            <div className="result-card">
              <h3
                style={{
                  margin: 0,
                  color: "var(--text-secondary)",
                  fontSize: "0.85rem",
                }}
              >
                Net Cash Flow
              </h3>

              <div className="value" id="netIncomeDisplay">
                GH₵0.00
              </div>

              <div className="status" id="netIncomeStatus">
                Breakeven
              </div>
            </div>
          </div>

          <div className="history-section">
            <h2 style={{ border: "none", marginBottom: "0.75rem" }}>
              Success Over Time (Historical Progress)
            </h2>

            <div className="history-scroll-hint" role="note">
              <span className="history-scroll-hint-icon" aria-hidden="true">
                ↔
              </span>
              <span>
                Swipe left or right to see all details, including liabilities,
                income, expenses, net worth, and actions.
              </span>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Logged Timestamp</th>
                    <th>Date</th>
                    <th>Assets</th>
                    <th>Saved Money</th>
                    <th>Liabilities</th>
                    <th>Income</th>
                    <th>Expenses</th>
                    <th>Net Worth</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody id="historyBody"></tbody>
              </table>
            </div>
          </div>

          <div className="blueprint-section">
            <div className="blueprint-title">
              Wealth-Building Roadmap Advisor
            </div>

            <div className="blueprint-content" id="blueprintContent"></div>
          </div>
        </div>

        {/* SUCCESS & GOALS VIEW */}
        <div id="successView" className="view-panel">
          <h2>Overall Success and Financial Goals</h2>

          <div className="success-metrics-grid">
            <div className="result-card">
              <h3
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.85rem",
                }}
              >
                Day-over-Day Financial Shifts
              </h3>

              <div className="value" id="deltaValue">
                GH₵0.00
              </div>

              <div className="status" id="deltaStatus">
                No historical baseline to compare against yet.
              </div>
            </div>

            <div className="result-card">
              <h3
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.85rem",
                }}
              >
                Financial Standing Score
              </h3>

              <div className="value" id="scoreValue">
                0 / 100
              </div>

              <div className="status" id="scoreStatus">
                Awaiting performance calculations
              </div>
            </div>
          </div>

          <div
            className="admin-card"
            style={{ backgroundColor: "var(--bg-input)" }}
          >
            <h3 style={{ color: "var(--color-income)" }}>
              Set Target Wealth Objectives
            </h3>

            <div className="inputs-grid" style={{ marginTop: "0.5rem" }}>
              <div className="input-group">
                <label htmlFor="goalType">Target Objective Metric Type</label>

                <select id="goalType">
                  <option value="netWorth">Target Net Worth</option>
                  <option value="savings">Target Money Saved</option>
                  <option value="expenses">Reduce Monthly Expenses Cap</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="goalPeriod">Goal Period</label>

                <select id="goalPeriod">
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="goalAmount">Target Threshold Amount</label>

                <input
                  type="number"
                  id="goalAmount"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <button
              className="btn-save"
              style={{ marginTop: "0.5rem" }}
              onClick={() => window.saveSystemGoal()}
            >
              Establish Active Goal Profile
            </button>

            <div style={{ marginTop: "1rem" }}>
              <h4
                style={{
                  margin: "0 0 0.5rem 0",
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                }}
              >
                Current Tracked Target Objectives Performance
              </h4>

              <div
                id="activeGoalsDisplay"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* CALCULATOR VIEW */}
        <div id="calcView" className="view-panel">
          <h2>Workspace Calculation Core</h2>

          <div className="calc-wrapper">
            <div className="calc-screen" id="calcScreen">
              0
            </div>

            <div className="calc-buttons">
              <button
                className="calc-btn clear"
                onClick={() => window.clearCalc()}
              >
                C
              </button>

              <button
                className="calc-btn op"
                onClick={() => window.pressOp("/")}
              >
                /
              </button>

              <button
                className="calc-btn op"
                onClick={() => window.pressOp("*")}
              >
                *
              </button>

              <button
                className="calc-btn op"
                onClick={() => window.pressOp("-")}
              >
                -
              </button>

              <button className="calc-btn" onClick={() => window.pressNum("7")}>
                7
              </button>

              <button className="calc-btn" onClick={() => window.pressNum("8")}>
                8
              </button>

              <button className="calc-btn" onClick={() => window.pressNum("9")}>
                9
              </button>

              <button
                className="calc-btn op"
                onClick={() => window.pressOp("+")}
              >
                +
              </button>

              <button className="calc-btn" onClick={() => window.pressNum("4")}>
                4
              </button>

              <button className="calc-btn" onClick={() => window.pressNum("5")}>
                5
              </button>

              <button className="calc-btn" onClick={() => window.pressNum("6")}>
                6
              </button>

              <button
                className="calc-btn op"
                onClick={() => window.pressOp(".")}
              >
                .
              </button>

              <button className="calc-btn" onClick={() => window.pressNum("1")}>
                1
              </button>

              <button className="calc-btn" onClick={() => window.pressNum("2")}>
                2
              </button>

              <button className="calc-btn" onClick={() => window.pressNum("3")}>
                3
              </button>

              <button className="calc-btn eq" onClick={() => window.runCalc()}>
                =
              </button>

              <button
                className="calc-btn"
                style={{ gridColumn: "span 2" }}
                onClick={() => window.pressNum("0")}
              >
                0
              </button>
            </div>
          </div>
        </div>

        {/* SETTINGS VIEW */}
        <div id="adminView" className="view-panel">
          <h2>System Preferences and Control Center</h2>

          <div className="admin-grid">
            <div className="admin-card">
              <h3 style={{ margin: 0, color: "var(--color-income)" }}>
                Manage Smart Classifier Vocabulary
              </h3>

              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                Add custom lookup triggers or drop old terms to gain absolute
                routing power.
              </p>

              <div className="vocabulary-manager">
                <div className="input-group">
                  <label htmlFor="vocabTargetCategory">Target Quadrant</label>

                  <select id="vocabTargetCategory">
                    <option value="income">Income List</option>
                    <option value="asset">Assets List</option>
                    <option value="liability">Liabilities List</option>
                    <option value="expense">Expenses List</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="newVocabWord">New Keyword / Phrase</label>

                  <input
                    type="text"
                    id="newVocabWord"
                    placeholder="e.g., dividends"
                  />
                </div>

                <button
                  className="btn-save btn-classify"
                  style={{ height: "34px" }}
                  onClick={() => window.addNewKeyword()}
                >
                  Inject Vocabulary Word
                </button>
              </div>

              <div className="input-group" style={{ marginTop: "0.5rem" }}>
                <label htmlFor="vocabExplorerFilter">
                  Active Vocabulary Deck Explorer
                </label>

                <select
                  id="vocabExplorerFilter"
                  onChange={() => window.renderVocabularyTags()}
                >
                  <option value="income">Income Deck</option>
                  <option value="asset">Assets Deck</option>
                  <option value="liability">Liabilities Deck</option>
                  <option value="expense">Expenses Deck</option>
                </select>

                <div className="vocab-list-wrapper" id="vocabDeckTags"></div>
              </div>
            </div>

            <div className="admin-card">
              <h3 style={{ margin: 0, color: "var(--color-expense)" }}>
                Interface Customization and Preferences
              </h3>

              <div className="input-group">
                <label htmlFor="siteCurrencySelector">Currency Format</label>

                <select id="siteCurrencySelector">
                  <option value="GHS">Ghana Cedi (GH₵)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="siteThemeSelector">
                  Select Workspace Theme
                </label>

                <select id="siteThemeSelector">
                  <option value="light">Light Theme</option>
                  <option value="dark">Dark Theme (Default)</option>
                </select>
              </div>

              <button
                className="btn-save"
                style={{
                  marginTop: "0.5rem",
                  backgroundColor: "var(--color-income)",
                }}
                onClick={() => window.commitAndSecurePreferences()}
              >
                Commit and Secure Preferences
              </button>
            </div>
          </div>

          <div
            className="admin-card"
            style={{
              border: "1px solid rgba(218, 54, 51, 0.3)",
            }}
          >
            <h3 style={{ margin: 0, color: "var(--color-liability)" }}>
              Master System State Control
            </h3>

            <p style={{ fontSize: "0.85rem", margin: 0 }}>
              Reset your configuration engine environment back to clean layout
              parameters.
            </p>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                marginTop: "0.5rem",
                alignItems: "center",
              }}
            >
              <button
                className="btn-save btn-danger"
                onClick={() => window.triggerSystemFactoryReset()}
              >
                Reset Factory Defaults
              </button>

              <button
                className="btn-save"
                style={{ backgroundColor: "var(--color-income)" }}
                onClick={() => window.exportSystemData()}
              >
                Export Data
              </button>

              <button
                className="btn-save"
                style={{ backgroundColor: "var(--color-asset)" }}
                onClick={() => document.getElementById("importFile").click()}
              >
                Import Data
              </button>

              <input
                type="file"
                id="importFile"
                accept=".json"
                style={{ display: "none" }}
                onChange={(event) => window.importSystemData(event)}
              />
            </div>
          </div>
        </div>

        {/* HELP VIEW */}
        <div id="helpView" className="view-panel">
          <h2>Welcome to CediFlow</h2>

          <div className="help-card">
            <h3 style={{ color: "var(--color-income)" }}>What is CediFlow?</h3>
            <p>
              CediFlow helps you keep track of your finances in one place. You
              can record what you own, what you owe, how much you earn, and what
              you spend. The dashboard brings these figures together so you can
              follow your net worth, monitor your cash flow, and see how your
              financial position changes over time.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-income)" }}>Getting Started</h3>
            <ol className="help-list">
              <li>
                <strong>Enter your financial details:</strong> Open the Metrics
                Dashboard and fill in your assets, liabilities, income,
                expenses, and money saved. Include money in your pocket wherever
                the app provides that field.
              </li>
              <li>
                <strong>Try the Smart Classifier:</strong> Enter an item or
                transaction description and its amount, then select Classify and
                Add. CediFlow will use the description to help sort it into a
                financial category.
              </li>
              <li>
                <strong>Save a daily record:</strong> Choose the date you want
                to record and select Log Entry for Selected Date. This saves a
                snapshot of your financial figures for that date.
              </li>
              <li>
                <strong>Review your history:</strong> Visit Success Over Time on
                the dashboard to look back at saved entries. Depending on the
                available controls, you can also edit or delete records.
              </li>
            </ol>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-asset)" }}>Metrics Dashboard</h3>
            <p>
              This is where you enter your figures and check your current
              financial position. It displays your net worth and cash flow,
              along with visual summaries of your finances and suggestions from
              the Wealth-Building Roadmap Advisor.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-income)" }}>
              Success &amp; Goals
            </h3>
            <p>
              Use this section to check changes in your financial figures, view
              your financial standing score, and set targets for net worth,
              savings, or expenses. Your saved records help you compare progress
              over time.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-expense)" }}>Calculator</h3>
            <p>
              Use the built-in calculator for quick sums and other basic
              calculations while reviewing your finances or planning a budget.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-income)" }}>Settings</h3>
            <p>
              Adjust your preferred currency and theme, manage words used by the
              Smart Classifier, and import or export your financial records.
              Export a backup before changing devices or clearing your browser
              data.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-asset)" }}>
              Your Data and Privacy
            </h3>
            <p>
              CediFlow stores your financial records and preferences in your
              browser's local storage. This means they may not follow you to
              another browser or device automatically. You can export your
              records from Settings to keep a separate backup. Read the Privacy
              Policy for more information.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-liability)" }}>Need More Help?</h3>
            <p>
              If something isn't working as expected, or you have an idea that
              could make CediFlow better, we'd like to hear from you. Use the
              Feedback section to send a suggestion or report a problem. You can
              also email the HR-Financials team at{" "}
              <a
                className="help-email"
                href="mailto:hrtechnologies003@gmail.com"
              >
                hrtechnologies003@gmail.com
              </a>
              .
            </p>
          </div>
        </div>

        <div id="privacyView" className="view-panel">
          <h2>Privacy Policy</h2>

          <p>
            <strong>Last updated:</strong> October 17, 2026
          </p>

          <p>
            This policy explains what happens to the information you enter into
            CediFlow, where it is stored, and the choices you have for managing
            it.
          </p>

          <h3>1. Information You Enter</h3>
          <p>
            You can enter financial figures, saved records, savings goals, and
            app preferences in CediFlow. The app uses these details to display
            your financial summaries, track changes, and support its budgeting
            and goal-setting features.
          </p>

          <p>
            CediFlow is designed to save its financial records and preferences
            in your browser's local storage. These records are generally kept on
            the device and browser where you use the app. They are not
            automatically synced to another device.
          </p>

          <p>
            Website hosting services may process technical information needed to
            deliver and maintain the site, such as information about requests
            made to the server. The exact information collected depends on the
            hosting provider and its configuration.
          </p>

          <p>
            If you email us at{" "}
            <a href="mailto:hrtechnologies003@gmail.com" className="help-email">
              hrtechnologies003@gmail.com
            </a>
            , your message is handled by your email provider and the recipient's
            email service.
          </p>

          <p>
            <strong>
              Do not enter bank login details, Mobile Money PINs, passwords, or
              Ghana Card numbers into CediFlow.
            </strong>
          </p>

          <h3>2. How Your Information Is Used</h3>
          <p>
            Information you enter is used to provide the features you choose to
            use, such as financial calculations, saved progress, personal
            targets, and app preferences.
          </p>

          <p>
            Information saved in your browser's local storage is not, by itself,
            a copy sent to the app owner. However, this does not mean that every
            part of your visit is necessarily private from your hosting provider
            or from external services you choose to use.
          </p>

          <p>
            When you submit the feedback form, the information you provide is
            processed by the form service used by CediFlow. That service may
            handle submissions according to its own privacy policy and terms.
          </p>

          <h3>3. Managing Your Information</h3>

          <h4>Access and Backup</h4>
          <p>
            Use Export Data in Settings to download a copy of your records when
            the export feature is available. Keep exported files somewhere
            secure, especially if they contain personal financial information.
          </p>

          <h4>Deleting Records</h4>
          <p>
            You can use CediFlow's reset controls or clear the site's data
            through your browser settings to remove locally saved information.
            Be careful: clearing site data may permanently remove records and
            preferences that you have not backed up.
          </p>

          <p>
            Exported files are stored separately from CediFlow. Removing data
            from your browser will not delete those files; you must remove them
            yourself if you no longer need them.
          </p>

          <h4>Keeping Your Information Safe</h4>
          <p>
            Your device and browser play an important role in protecting locally
            stored records. Use a device you trust, keep it protected with a
            screen lock, and avoid giving other people access to your browser
            profile.
          </p>

          <h3>4. Browser and Device Changes</h3>
          <p>
            Your saved records may not be available if you switch browsers, use
            a different device, or clear your browser's site data. Export a
            backup before making changes if you need to keep your information.
          </p>

          <h3>5. External Services</h3>
          <p>
            CediFlow uses an external service to display its feedback form. If
            you choose to submit feedback, the details you provide are handled
            by that service. Check the service's own privacy information if you
            want to know more about how it handles submissions.
          </p>

          <h3>6. Changes to This Policy</h3>
          <p>
            This policy may change if CediFlow's features or data practices
            change. When an update is made, the revised version will be
            published on this page. Check back from time to time for updates.
          </p>

          <h3>7. Contact</h3>
          <p>
            If you have a question about this policy, contact us at{" "}
            <a href="mailto:hrtechnologies003@gmail.com" className="help-email">
              hrtechnologies003@gmail.com
            </a>
            . Please do not include passwords, PINs, or other sensitive
            information in your message.
          </p>
        </div>

        <div id="feedbackView" className="view-panel">
          <h2>Feedback</h2>

          <div className="help-card">
            <h3>Help Us Improve CediFlow</h3>

            <p>
              We are building CediFlow for you. Have a suggestion, found a bug,
              or have a feature you want us to add?
            </p>

            <p>We would love to hear from you. It takes less than 1 minute.</p>

            <button
              type="button"
              className="btn-save"
              data-tally-open="bZV6p7"
              data-tally-layout="modal"
              data-tally-width="700"
              data-tally-overlay="1"
              data-tally-emoji-text="👋"
              data-tally-emoji-animation="wave"
              data-tally-auto-close="2000"
              data-tally-form-events-forwarding="1"
              data-tally-hide-title="1"
            >
              Share Feedback
            </button>

            <p style={{ fontSize: "13px", marginTop: "12px", opacity: "0.7" }}>
              Note: This form will never ask for your password or PIN. Please
              keep sensitive information private.
            </p>
          </div>
        </div>
      </div>

      <footer className="app-footer">
        <p>
          &copy; <span id="footerYear"></span> CediFlow. All rights reserved.
          Built for personal financial health, wealth tracking, and long-term
          growth.
        </p>

        <div className="footer-links">
          <button onClick={() => switchTab("privacyView")}>
            Privacy Policy
          </button>
          <button onClick={() => switchTab("feedbackView")}>Feedback</button>
        </div>
      </footer>
    </>
  );
}

export default App;
