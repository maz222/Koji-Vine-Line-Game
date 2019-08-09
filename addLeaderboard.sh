#!/bin/bash

echo "Moving to ./frontend"
cd frontend

echo "Updating koji-tools"
npm remove koji-tools

echo "Install frontend deps"
npm install --save-dev @babel/plugin-syntax-dynamic-import @babel/plugin-transform-react-jsx @babel/plugin-proposal-class-properties babel-preset-preact
npm install preact prop-types koji-tools

echo "Writing .babelrc"
rm .babelrc
echo "{
  \"plugins\": [
    [\"@babel/plugin-syntax-dynamic-import\"],
    [\"@babel/plugin-proposal-class-properties\"],
    [\"@babel/plugin-transform-react-jsx\", { \"pragma\":\"h\" }]
  ],
  \"presets\": [
    \"preact\"
  ]
}" >> .babelrc

echo "Creating folders"
mkdir ./app
mkdir ./app/components
mkdir ./app/game

echo "Writing files"
rm ./app/components/App.js;
echo "import { h, Component } from 'preact';
import GameContainer from './GameContainer';
import Leaderboard from './Leaderboard';
import SetScore from './SetScore';

export default class App extends Component {
	state = {
		score: 0,
		view: 'game',
	};

	componentDidMount() {
		window.setAppView = view => { this.setState({ view }); }
		window.setScore = score => { this.setState({ score }); }
	}

	render() {
		if (this.state.view === 'game') {
			return (
				<div>
					<GameContainer />
				</div>
			)
		}
		if (this.state.view === 'setScore') {
			return (
				<div>
					<SetScore score={this.state.score} />
				</div>
			)
		}
		if (this.state.view === 'leaderboard') {
			return (
				<div>
					<Leaderboard />
				</div>
			)
		}
		return null;
	}
}" >> ./app/components/App.js

rm ./app/components/SetScore.js;

FETCHONE='`${Koji.config.serviceMap.backend}/leaderboard/save`'

echo "import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import Koji from 'koji-tools';

class SetScore extends Component {
  static propTypes = {
    score: PropTypes.number,
  };

  state = {
    // email: '',
    name: '',
    isSubmitting: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({ isSubmitting: true });

    const body = {
      name: this.state.name,
      score: this.props.score,
      // privateAttributes: {
      //    email: this.state.email,
      // },
    };

    fetch(${FETCHONE}, {
      method: 'post',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
          console.log(jsonResponse);

          window.setAppView('leaderboard');
      })
      .catch(err => {
          console.log(err);
      });
  }

  render() {
    return (
      <div id={'leaderboard-set-score'}>
        <form
          id={'score-form'}
          onSubmit={this.handleSubmit}
        >
          <h2>
            {'Submit to Leaderboard'}
          </h2>

          <div className={'input-wrapper'}>
            <label className={'label'}>
              {'Your Score'}
            </label>
            <input
              disabled
              value={this.props.score}
            />
          </div>

          <div className={'input-wrapper'}>
            <label className={'label'}>
              {'Your Name'}
            </label>
            <input
              onChange={(event) => {
                this.setState({ name: event.target.value });
              }}
              type={'text'}
              value={this.state.name}
            />
          </div>

          {/* <div className={'input-wrapper'}>
            <label>{'Your Email Address (Private)'}</label>
            <input
              onChange={(event) => {
                this.setState({ email: event.target.value });
              }}
              type={'email'}
              value={this.state.email}
            />
          </div> */}

          <button
            disabled={this.state.isSubmitting}
            onClick={this.handleSubmit}
            type={'submit'}
          >
            {'Submit'}
          </button>
          </form>
      </div>
    )
  }
}

export default SetScore;" >> ./app/components/SetScore.js

rm ./app/components/GameContainer.js;
echo "import { h, Component } from 'preact';
import PropTypes from 'prop-types';

// Note: If you are using p5, you can uncomment all of the p5 lines
// and things should just work =)

// const { p5 } = window;

class GameContainer extends Component {
  componentDidMount() {
    // require('script-loader!app/game/index.js');
    // require('script-loader!app/game/utilities.js');
    // require('script-loader!app/game/clickable.js');
    // require('script-loader!app/game/entities.js');
    // this.p5Game = new p5(null, document.getElementById('game-container'));
  }

  componentWillUnmount() {
    // this.p5Game.remove();
  }

  render() {
    return (
      <div id={'game-container'} />
    );
  }
}

export default GameContainer;" >>  ./app/components/GameContainer.js

rm ./app/components/Leaderboard.js;

FETCHTWO='`${Koji.config.serviceMap.backend}/leaderboard`'
NAMESTRING='`${index + 1}. ${score.name}`'

echo "import { h, Component } from 'preact';
import Koji from 'koji-tools';

class Leaderboard extends Component {
  state = {
    scores: [],
    dataIsLoaded: false,
    error: false,
  };

  componentDidMount() {
    fetch(${FETCHTWO})
      .then((response) => response.json())
      .then(({ scores }) => {
        this.setState({ dataIsLoaded: true, scores });
      })
      .catch(err => {
        console.log('Fetch Error: ', err);
        this.setState({ error: true });
      });
  }

  render() {
    if (this.state.error) {
      return (
        <div id={'leaderboard'}>
          <div className={'leaderboard-loading'}>
            <div>{'Error!'}</div>
            <button onClick={() => window.setAppView('game')}>
              {'Back to Game'}
            </button>
          </div>
        </div>
      );
    }

    if (!this.state.dataIsLoaded) {
      return (
        <div id={'leaderboard'}>
          <div className={'leaderboard-loading'}>
            {'Loading...'}
          </div>
        </div>
      );
    }

    return (
      <div id={'leaderboard'}>
        <div className={'leaderboard-container'}>
          <div class={'leaderboard-title'}>
          <div class={'leaderboard-title-text'}>{'Top scores'}</div>
            <div
              class={'leaderboard-close-button'}
              onClick={() => { window.setAppView('game'); }}
            >
              {'Close'}
            </div>
          </div>
          <div className={'leaderboard-contents'}>
            {
              this.state.scores.map((score, index) => (
                <div
                  className={'score-row'}
                  key={index}
                >
                  <div className={'name'}>
                    {${NAMESTRING}}
                  </div>
                  <div className={'score'}>
                    {score.score}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Leaderboard;" >> ./app/components/Leaderboard.js

mkdir ./game

rm ./common/leaderboardStyles.css
echo "#leaderboard {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100vw - 24px);
  height: calc(100vh - 24px);
  background-color: #111;
  color: white;
  z-index: 999;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

#leaderboard-set-score {
  margin: 24px auto;
  width: calc(100vw - 84px);
  max-width: 600px;
  background-color: #111;
  border: 2px solid white;
  border-radius: 12px;
  color: white;
  z-index: 999;
  display: flex;
  flex-direction: column;
  padding: 18px;
}

#leaderboard-set-score form {
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  width: 100%;
}

#leaderboard-set-score .input-wrapper {
  display: flex;
  align-items: center;
}

#leaderboard-set-score .label {
  flex: 1;
  font-size: 14px;
  padding: 2px 0;
}

#leaderboard-set-score input {
  flex: 2;
  padding: 8px;
  font-size: 16px;
  margin: 8px 0 8px 8px;
}
#leaderboard-set-score button[type="submit"] {
  padding: 8px;
  font-size: 16px;
  margin: 3px 0;
}

#leaderboard-set-score .close-button {
  display: flex;
  text-align: center;
  padding: 12px;
  justify-content: center;
  font-weight: bold;
}

#leaderboard-set-score .title {
  font-size: 24px;
  text-align: center;
  padding: 2px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  font-weight: bold;
}

#leaderboard .leaderboard-container {
  display: flex;
  flex-direction: column;
}
#leaderboard .leaderboard-title {
  padding: 2px 0;

  display: flex;
  align-items: center;
}

#leaderboard .leaderboard-title-text {
  font-size: 24px;
  font-weight: bole;
}
#leaderboard .leaderboard-close-button {
  cursor: pointer;
  margin-left: auto;
}
#leaderboard .leaderboard-close-button:hover {
  text-decoration: underline;
}

#leaderboard .leaderboard-contents {
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  font-size: 18px;
}

#leaderboard .score-row {
  display: flex;
  padding: 6px 12px;
}

#leaderboard .score-row:nth-of-type(odd) {
  background-color: rgba(255, 255, 255, 0.1);
}

#leaderboard .name {
  width: 100%;
}

#leaderboard .name span {
  font-weight: bold;
}

#leaderboard .score {
  width: 100%;
  text-align: right;
}" >> ./common/leaderboardStyles.css

rm ./common/index.js
echo "import { h, render } from 'preact';
import Koji from 'koji-tools';
import './leaderboardStyles.css';
import './index.css';

window.Koji = Koji;

Koji.pageLoad();

let root;
function init() {
	let App = require('../app/components/App').default;
	root = render(<App />, document.body, root);
}

// in development, set up HMR:
if (module.hot) {
	//require('preact/devtools');   // turn this on if you want to enable React DevTools!
	module.hot.accept('../app/components/App', () => requestAnimationFrame(init) );
}

init();" >> ./common/index.js

echo "Moving to ./backend"
cd ..
rm -rf ./backend
mkdir backend
cd backend

echo "Writing backend package.json"
echo '{
  "name": "koji-project-backend",
  "version": "1.0.0",
  "scripts": {
    "compile": "babel src -d dist --copy-files --ignore \"node_modules/**/*.js\"",
    "start-dev": "NODE_ENV=development babel-watch -L --watch ../.koji/ src/server.js",
    "start": "NODE_ENV=production node dist/server.js"
  },
  "dependencies": {
    "@withkoji/database": "^1.0.13",
    "babel-polyfill": "^6.26.0",
    "body-parser": "^1.18.3",
    "cors": "^2.8.5",
    "express": "4.16.3",
    "uuid": "^3.3.2"
  },
  "devDependencies": {
    "@babel/cli": "7.2.3",
    "@babel/core": "7.2.2",
    "@babel/preset-env": "7.3.1",
    "babel-plugin-dynamic-import-node": "1.2.0",
    "babel-plugin-transform-object-rest-spread": "6.26.0",
    "babel-preset-env": "1.7.0",
    "babel-preset-stage-0": "6.24.1",
    "babel-watch": "git+https://github.com/kmagiera/babel-watch.git"
  }
}' >> ./package.json

echo "Installing deps"
npm install

echo '{
  "presets": ["@babel/preset-env"],
  "plugins": ["@babel/plugin-proposal-object-rest-spread"]
}' >> ./.babelrc

echo "Creating src folder"
mkdir src

echo "Writing server files"
echo "import Database from '@withkoji/database';
import uuid from 'uuid';

export default function (app) {
  app.get('/test', async (req, res) => {
    res.status(200).json({
      test: true,
      more: 'more',
    });
  })

    app.get('/leaderboard', async (req, res) => {
        const database = new Database();
        const rawScores = await database.get('leaderboard');

        // We don't want to return private attributes to consumers of this
        // endpoint, so strip them out, sort the records so the top scores
        // appear first, and then only return the top 100 scores
        const scores = rawScores
            .map(({ name, score, dateCreated }) => ({
                name,
                score,
                dateCreated
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 100);

        res.status(200).json({
            success: true,
            scores,
        });
    });

    app.post('/leaderboard/save', async (req, res) => {
        const recordId = uuid.v4();
        const recordBody = {
            name: req.body.name,
            score: req.body.score,
            privateAttributes: req.body.privateAttributes,
            dateCreated: Math.round(Date.now() / 1000),
        };

        const database = new Database();
        await database.set('leaderboard', recordId, recordBody);

        res.status(200).json({
            success: true,
        });
    });
}" >> ./src/leaderboard.js

echo "import 'babel-polyfill';
import express from 'express';
import * as fs from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';

// Import any routes we're going to be using
import leaderboard from './leaderboard';

// Create server
const app = express();

// Specifically enable CORS for pre-flight options requests
app.options('*', cors())

// Enable body parsers for reading POST data. We set up this app to 
// accept JSON bodies and x-www-form-urlencoded bodies. If you wanted to
// process other request tpes, like form-data or graphql, you would need
// to include the appropriate parser middlewares here.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  limit: '2mb',
  extended: true,
}));

// CORS allows these API routes to be requested directly by browsers
app.use(cors());

// Disable caching
app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

// Enable routes we want to use
leaderboard(app);

// Start server
app.listen(process.env.PORT || 3333, null, async err => {
    if (err) {
        console.log(err.message);
    }
    console.log('[koji] backend started');
});" >> ./src/server.js

echo "Moving to root folder"
cd ..

echo "Updating deploy.json"

rm ./.koji/project/deploy.json
echo '{
  "deploy": {
    "subdomain": ".withkoji.com",
    "frontend": {
      "output": "frontend/build",
      "commands": [
        "cd frontend",
        "npm install",
        "export NODE_ENV=production && npm run build"
      ]
    },
    "backend": {
      "output": "backend",
      "type": "dynamic",
      "commands": [
        "cd backend",
        "npm install",
        "export NODE_ENV=production && npm run compile"
      ]
    }
  }
}' >> ./.koji/project/deploy.json

exit