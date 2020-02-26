import { h, Component } from 'preact';
import HoverButton from './ReactButtons.js';


class TitlePage extends Component {
    constructor(props) {
        super(props);
        let sessionMute = sessionStorage.getItem('isMuted');
        if(sessionMute === undefined || sessionMute === 'true') {
            sessionMute = true;
        }
        else {
            sessionMute = false;
        }
        this.state = {muted:sessionMute};
    }
    componentWillUnmount() {
        sessionStorage.setItem('isMuted',this.state.muted);
    }
    render() {
        const VCC = Koji.config.titleScreen;
        let pageColor = VCC.background.backgroundColor;
        let pageStyle = {
            width:'100%',
            height:'100vh',
            display:'flex',
            justifyContent:'center',
            backgroundSize:'cover',
            backgroundColor:pageColor
        };
        let pageImage = VCC.background.backgroundImage;
        if(pageImage != "" && pageImage != undefined) {
            pageStyle = {...pageStyle, backgroundImage:`url(${pageImage})`};
        }

        let wrapperStyle = {
            width:'600px',
            height:'100%',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'space-around',
            flexDirection:'column'
        };

        let soundImgStyle = {
            height:'30px',
            width:'auto'
        };
        let soundButtonStyle = {
            position:'absolute',
            top:'25px',
            right:'25px',
            backgroundColor:'rgba(0,0,0,.3)',
            width:'60px',
            height:'60px',
            borderRadius:'100px',
            border:0
        };
        let imgUrl = this.state.muted ? Koji.config.gameScene.soundButton.offImage : Koji.config.gameScene.soundButton.onImage;
        let SoundButton = <HoverButton styling={soundButtonStyle} content={<img src={imgUrl} style={soundImgStyle} />} callback = {() => this.setState({muted:!this.state.muted})} />;

        let logoStyle = {
            maxWidth:'100%',
            height:'auto',
            fontSize: '2em',
        };
        let image = VCC.title.logo;
        let titleText = VCC.title.content;
        let titleColor = VCC.title.color;
        let leaderboardStyling = {
            backgroundColor:VCC.leaderboardButton.backgroundColor,
            color:VCC.leaderboardButton.color,
            fontSize:'1.25em',
            width:'calc(80% - 20px)',
            padding:'10px',
            border:'1px solid rgba(0,0,0,.15)',
            borderRadius:'4px'           
        };
        let LeaderboardButton = <HoverButton styling={leaderboardStyling} content={VCC.leaderboardButton.content} callback={() => {window.setAppView('leaderboard')}} />;

        let playText = VCC.playButton.content;
        let playColor = VCC.playButton.color;
        let playBackgroundColor = VCC.playButton.backgroundColor;
        let playStyling = {
            backgroundColor:playBackgroundColor,
            color:playColor,
            fontSize:'1.25em',
            width:'calc(80% - 20px)',
            padding:'10px',
            border:'1px solid rgba(0,0,0,.15)',
            borderRadius:'4px'
        };
        let PlayButton = <HoverButton styling={playStyling} content={playText} callback={() => {window.setAppView("levels")}}/>;

        let tutorialText = VCC.howToPlayButton.content;
        let tutorialColor = VCC.howToPlayButton.color;
        let tutorialBackgroundColor = VCC.howToPlayButton.backgroundColor;
        let tutorialStyling = {
            backgroundColor:tutorialBackgroundColor,
            color:tutorialColor,
            fontSize:'1.25em',
            width:'calc(80% - 20px)',
            padding:'10px',
            border:'1px solid rgba(0,0,0,.15)',
            borderRadius:'4px'
        };
        let TutorialButton = <HoverButton styling={tutorialStyling} content={tutorialText} callback={() => {window.setAppView("tutorial")}}/>;

        let soundImage = this.state.muted ? null : null;
        let soundColor = 'rgba(0,0,0,0)';
        let soundHoverColor = 'rgba(0,0,0,.25)';
        let soundCallback = () => {this.setState({muted:!this.state.muted})};

        return(
            <div style={pageStyle}>
                {SoundButton}
                <div style={wrapperStyle}>
                {image == "" || image == undefined? 
                    <h1 style={{...logoStyle, color:titleColor}}>{titleText}</h1> :
                    <img src={image} style={logoStyle}></img>
                }
                {LeaderboardButton}
                {PlayButton}
                {TutorialButton}
                </div>
            </div>
        );
    }
}

export default TitlePage;