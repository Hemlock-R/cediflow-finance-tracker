const switchTab = window.switchTab;

function App() {
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
          className="nav-tab"
          onClick={(event) => switchTab("adminView", event.currentTarget)}
        >
          Settings
        </button>

        <button
          className="nav-tab"
          onClick={(event) => switchTab("helpView", event.currentTarget)}
        >
          Need Help
        </button>
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
              <label htmlFor="pocketMoney">Money in Pocket</label>
              <input
                type="number"
                id="pocketMoney"
                placeholder="0.00"
                min="0"
                step="0.01"
                onChange={() => window.calculateAndCompare()}
              />
            </div>

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
                INCOME
                <span className="sketch-val" id="sketchIncome">
                  GH₵0.00
                </span>
              </div>

              <div className="sketch-row sketch-expenses" id="rowExpenses">
                EXPENSES
                <span className="sketch-val" id="sketchExpenses">
                  GH₵0.00
                </span>
              </div>

              <div className="sketch-split">
                <div className="sketch-col sketch-assets" id="colAssets">
                  ASSETS
                  <span className="sketch-val" id="sketchAssets">
                    GH₵0.00
                  </span>
                </div>

                <div
                  className="sketch-col sketch-liabilities"
                  id="colLiabilities"
                >
                  LIABILITIES
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

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Logged Timestamp</th>
                    <th>Date</th>
                    <th>Assets</th>
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
                <label>Target Objective Metric Type</label>

                <select id="goalType">
                  <option value="netWorth">Target Net Worth</option>
                  <option value="savings">Target Money Saved</option>
                  <option value="expenses">Reduce Monthly Expenses Cap</option>
                </select>
              </div>

              <div className="input-group">
                <label>Goal Period</label>

                <select id="goalPeriod">
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              <div className="input-group">
                <label>Target Threshold Amount</label>

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
                  <label>Target Quadrant</label>

                  <select id="vocabTargetCategory">
                    <option value="income">Income List</option>
                    <option value="asset">Assets List</option>
                    <option value="liability">Liabilities List</option>
                    <option value="expense">Expenses List</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>New Keyword / Phrase</label>

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
                <label>Active Vocabulary Deck Explorer</label>

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
                <label>Currency Format</label>

                <select id="siteCurrencySelector">
                  <option value="GHS">Ghana Cedi (GH₵)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>

              <div className="input-group">
                <label>Select Workspace Theme</label>

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
          <h2>Welcome to CediFlow-Financial-Tracker</h2>

          <div className="help-card">
            <h3 style={{ color: "var(--color-income)" }}>
              What is CediFlow-Financial-Tracker?
            </h3>

            <p>
              CediFlow-Financial-Tracker is a personal finance dashboard that
              helps you track your assets, liabilities, income, and expenses in
              one place. It calculates your net worth and net cash flow in real
              time, lets you set financial goals, and keeps a running history of
              your progress over time. All data is stored securely in your own
              browser.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-income)" }}>
              Getting Started - Quick Start
            </h3>

            <ol className="help-list">
              <li>
                <strong>Enter your numbers:</strong> On the{" "}
                <em>Metrics Dashboard</em>, fill in your Total Assets,
                Liabilities, Income, Expenses, Money in Pocket, and Money Saved.
              </li>

              <li>
                <strong>Use the Smart Classifier:</strong> Type an item name and
                amount and click <em>Classify and Add</em>. The app
                automatically sorts it into the right category.
              </li>

              <li>
                <strong>Log your day:</strong> Pick a date and click{" "}
                <em>Log Entry for Selected Date</em> to save a snapshot of your
                financial position.
              </li>

              <li>
                <strong>Review your history:</strong> Your saved entries appear
                in the <em>Success Over Time</em> table, where you can edit or
                delete them.
              </li>
            </ol>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-asset)" }}>Metrics Dashboard</h3>

            <p>
              This is your main workspace. Enter your financial values and
              instantly see visual bars, a balance sketch, your net worth, and
              net cash flow. The <em>Wealth-Building Roadmap Advisor</em> gives
              you personalized tips based on your numbers.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-income)" }}>
              Success &amp; Goals
            </h3>

            <p>
              Track your financial standing with a score out of 100, view your
              day-over-day shifts, and set target objectives like a target net
              worth or savings goal. Progress bars show how close you are to
              reaching them.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-expense)" }}>Calculator</h3>

            <p>
              A handy built-in calculator for any quick math you need while
              planning your finances.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-income)" }}>Settings</h3>

            <p>
              Customize the app: manage the Smart Classifier vocabulary, change
              currency, and theme. You can also export/import your preferences
              and financial data.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-asset)" }}>Data &amp; Privacy</h3>

            <p>
              Everything is stored in your browser's local storage. Use the{" "}
              <em>Export Data</em> button in Settings to download a backup, and{" "}
              <em>Import Data</em> to restore it on another device or browser.
            </p>
          </div>

          <div className="help-card">
            <h3 style={{ color: "var(--color-liability)" }}>
              ❓ Need More Help?
            </h3>

            <p>
              If you have any questions or feedback, email the HR-Financials
              team at{" "}
              <a
                className="help-email"
                href="mailto:hrtechnologies003@gmail.com"
              >
                hrtechnologies003@gmail.com
              </a>{" "}
              — tap the address and it will open your email app to send us a
              message. We're here to help you build and protect your wealth.
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
      </footer>
    </>
  );
}

export default App;

