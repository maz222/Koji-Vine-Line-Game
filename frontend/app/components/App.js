import { h, Component } from 'preact';
import GameContainer from './GameContainer';
import Leaderboard from './Leaderboard';
import TitlePage from './TitlePage';
import LevelPage from './LevelPage';
import EndPage from './LevelEndPage';
import TutorialPage from './Tutorial';


export default class App extends Component {
	state = {
		view: 'intro',
	};

	componentDidMount() {
		window.setAppView = view => { this.setState({ view }); }
		window.setScore = score => { this.setState({ score }); }
        sessionStorage.setItem('isMuted','true');
        let loadingAnimation = document.querySelector('#p5_loading');
        //loadingAnimation.setAttribute("style","display:none");
		loadingAnimation.parentNode.removeChild(loadingAnimation);
	}

    getScore() {
        let scores = JSON.parse(localStorage.getItem('scores'));
        console.log(scores);
        if(scores == undefined) {
            return 0;
        }
        let levels = Object.keys(scores);
        let score = 0;
        for(var l in levels) {
            score += scores[levels[l]];
        }
        return score;
    }

	render() {
        console.log(this.state.view);
        if(this.state.view === 'intro') {
            return(
                <TitlePage />
            )
        }
        if(this.state.view === 'levels') {
            return(
                <LevelPage levels={Koji.config.levelSelect.gameLevels}/>
            )
        }
		if (this.state.view === 'game') {
			return (
				<div>				
					<GameContainer />
				</div>
			)
		}
        if(this.state.view === 'gameWin') {
            let bannerVCC = Koji.config.endScreen.winBanner;
            let backgroundVCC = Koji.config.endScreen.winBackground;
            return(
                <EndPage page={backgroundVCC} banner={bannerVCC} score={this.getScore()}/>
            )
        }
        if(this.state.view === 'gameLoss') {
            let bannerVCC = Koji.config.endScreen.loseBanner;
            let backgroundVCC = Koji.config.endScreen.loseBackground;
            return(
                <EndPage page={backgroundVCC} banner={bannerVCC} score={this.getScore()}/>
            )       
        }
		if (this.state.view === 'leaderboard') {
			return (
				<div>
					<Leaderboard />
				</div>
			)
		}
        if(this.state.view === 'tutorial') {
            return (
                <TutorialPage />
            )
        }
		return null;
	}
}
