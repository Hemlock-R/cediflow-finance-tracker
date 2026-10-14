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
        <span className="app-logo">CF</span>

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
                ⚙️ Settings
              </button>

              <button
                className="side-panel-link"
                onClick={() => {
                  switchTab("helpView");
                  setMenuOpen(false);
                }}
              >
                ❓ Need Help
              </button>

              <button
                className="side-panel-link"
                onClick={() => {
                  switchTab("privacyView");
                  setMenuOpen(false);
                }}
              >
                🔒 Privacy Policy
              </button>

              <button
                className="side-panel-link"
                onClick={() => {
                  switchTab("feedbackView");
                  setMenuOpen(false);
                }}
              >
                💬 Feedback
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
              CediFlow is your personal finance dashboard. Track your assets,
              liabilities, income, and expenses in one place. See your net worth
              and cash flow in real time, set savings goals, and track your
              progress over time. Everything stays securely in your browser.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-income)" }}>Quick Start Guide</h3>
            <ol className="help-list">
              <li>
                <strong>Enter your numbers:</strong> Go to the Metrics Dashboard
                and add your Assets, Liabilities, Income, Expenses, Money in
                Pocket, and Money Saved.
              </li>
              <li>
                <strong>Use Smart Classifier:</strong> Just type an item name
                and amount, then click Classify and Add. We will sort it for
                you.
              </li>
              <li>
                <strong>Log your day:</strong> Pick a date and click Log Entry
                to save your financial snapshot for that day.
              </li>
              <li>
                <strong>Track your progress:</strong> All your entries will
                appear in Success Over Time where you can edit or delete them.
              </li>
            </ol>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-asset)" }}>Metrics Dashboard</h3>
            <p>
              This is your main workspace. Enter your numbers and instantly see
              visual charts, your net worth, cash flow, and personalized tips
              from our Wealth-Building Roadmap Advisor.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-income)" }}>Success & Goals</h3>
            <p>
              Get a financial score out of 100, see how your finances change day
              by day, and set targets like your ideal net worth or savings goal.
              Progress bars keep you motivated.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-expense)" }}>Calculator</h3>
            <p>
              A quick built-in calculator for any math you need while planning.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-income)" }}>Settings</h3>
            <p>
              Make CediFlow yours. Change currency to GHS, switch themes, manage
              your Smart Classifier words, and export or import your data.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-asset)" }}>Your Data & Privacy</h3>
            <p>
              Your data is stored only in your browser. Use Export Data in
              Settings to download a backup, and Import Data to restore it on
              another device.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-liability)" }}>Need More Help?</h3>
            <p>
              Have a question or idea? Send us feedback through our feedback
              form or email the HR-Financials team at{" "}
              <a
                className="help-email"
                href="mailto:hrtechnologies003@gmail.com"
              >
                hrtechnologies003@gmail.com
              </a>
              . We are here to help you build wealth.
            </p>
          </div>
        </div>
      </div>

      <div id="privacyView" className="view-panel">
        <h2>Privacy Policy</h2>
        <p>
          <strong>Last updated:</strong> October 14, 2026
        </p>

        <p>
          CediFlow respects your privacy. This policy explains what information
          you enter, how it is stored, and how you can manage it.
        </p>

        <h3>1. Information We Collect</h3>
        <p>
          CediFlow allows you to enter financial records, savings goals,
          transaction history, and preferences. This information is used to
          provide financial tracking and budgeting features.
        </p>
        <p>
          All records and preferences are stored in your browser's local
          storage. This means the information stays on your device and remains
          available after you close the app.
        </p>
        <p>
          When you visit the website, hosting providers and browser services may
          process standard technical information such as device type and browser
          version.
        </p>
        <p>
          If you contact us by email at hrtechnologies003@gmail.com, the
          information you include in your message will be sent through your
          email provider.
        </p>
        <p>
          <strong>
            Please do not enter bank login details, Mobile Money PINs,
            passwords, or Ghana Card numbers into CediFlow.
          </strong>
        </p>

        <h3>2. How We Use Your Information</h3>
        <p>
          Your information is used only to support CediFlow's core features,
          including tracking your finances and saving your preferences.
        </p>
        <p>
          Information in local storage does not automatically transfer to the
          app owner. It remains on your device until you delete it.
        </p>
        <p>
          Technical information related to website hosting and browser services
          is processed separately to keep the website functional.
        </p>

        <h3>3. Your Rights and Choices</h3>
        <h4>Access and Backup</h4>
        <p>
          You can use the export feature inside CediFlow to create a backup of
          your records. Store any exported files in a secure location.
        </p>

        <h4>Deletion</h4>
        <p>
          You can delete your information at any time using the reset controls
          in CediFlow or by clearing your browser's site data. Please note that
          clearing browser data will remove your saved records and preferences.
        </p>
        <p>
          Exported backup files are stored separately. You will need to delete
          them manually.
        </p>

        <h4>Security</h4>
        <p>
          Protecting your information also depends on your device and browser
          security. Keep your device locked and avoid sharing access with
          others.
        </p>

        <h4>Contact</h4>
        <p>
          For privacy questions or feedback, contact us at
          hrtechnologies003@gmail.com. Do not include sensitive information such
          as passwords or bank details in your email.
        </p>

        <h3>4. Storage Information</h3>
        <p>
          Records stored in local storage may not be available if you switch to
          a different browser or device. Clearing browser data may also remove
          your records. Keep a backup if you need to preserve important
          information.
        </p>

        <h3>5. Changes to This Policy</h3>
        <p>
          We may update this policy when CediFlow features or data practices
          change. Any changes will be published on this page. Please review this
          page periodically.
        </p>
      </div>

      <div id="feedbackView" className="view-panel">
        <h2>Feedback</h2>

        <div className="help-card">
          <h3>Help Us Improve CediFlow</h3>

          <p>
            We are building CediFlow for you. Have a suggestion, found a bug, or
            have a feature you want us to add?
          </p>

          <p>We would love to hear from you. It takes less than 1 minute.</p>

          <button
            type="button"
            className="btn-save"
            data-tally-open="44Wq4d"
            data-tally-width="300"
            data-tally-emoji-text="👋"
            data-tally-emoji-animation="wave"
            data-tally-auto-close="2000"
            data-tally-form-events-forwarding="1"
          >
            Share Feedback
          </button>

          <p style={{ fontSize: "13px", marginTop: "12px", opacity: "0.7" }}>
            Note: This form will never ask for your password or PIN. Please keep
            sensitive information private.
          </p>
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
