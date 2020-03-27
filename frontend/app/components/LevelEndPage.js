import { h, Component } from 'preact';

import HoverButton from './ReactButtons.js';

//props:
    //page - {backgroundColor,backgroundImage}
    //banner - {backgroundColor,color,content}
class EndPage extends Component {
	render() {
		const VCC = Koji.config.endScreen;
		let pageColor = this.props.page.backgroundColor;
        let pageStyle = {
            width:'100%',
            height:'100vh',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            backgroundSize:'cover',
            backgroundColor:pageColor,
        };
        let pageImage = this.props.page.backgroundImage;
        if(pageImage != "" && pageImage != undefined) {
            pageStyle = {...pageStyle, backgroundImage:`url(${pageImage})`};
        }

		let bannerColor = this.props.banner.backgroundColor;
        let bannerStyle = {
        	color:this.props.banner.textColor,
            width:'calc(100% - 40px)',
            padding:'20px',
            textAlign:'center',
            height:'40px',
            backgroundColor:bannerColor,
            top:'0px',
            borderBottom:'1px solid rgba(0,0,0,.25)'
        };
		let bannerContent = this.props.banner.content;


		let buttonStyle = {
			fontSize:'1em',
            width:'calc(60% - 20px)',
            padding:'10px',
            border:'1px solid rgba(0,0,0,.15)',
            borderRadius:'4px',
            margin:'10px 0 10px 0'
		};

		let replayStyle = {
			...buttonStyle,
			backgroundColor:VCC.playAgainButton.backgroundColor,
			color:VCC.playAgainButton.color
		};
		let replayContent = VCC.playAgainButton.content;
		let replayCallback = () => {window.setAppView("game")};
		let ReplayButton = <HoverButton styling={replayStyle} content={replayContent} callback={replayCallback}/>;

		let levelScreenStyle ={
			...buttonStyle,
			backgroundColor:VCC.levelButton.backgroundColor,
			color:VCC.levelButton.color
		};
		let levelScreenContent = VCC.levelButton.content;
		let levelScreenCallback = () => {window.setAppView("levels")};
		let LevelScreenButton = <HoverButton styling={levelScreenStyle} content={levelScreenContent} callback={levelScreenCallback}/>;


		let quitStyle = {
			...buttonStyle,
			backgroundColor:VCC.quitButton.backgroundColor,
			color:VCC.quitButton.color
		};
		let quitContent = VCC.quitButton.content;
		let quitCallback = () => {window.setAppView("intro")};
		let QuitButton = <HoverButton styling={quitStyle} content={quitContent} callback={quitCallback}/>

		return(
			<div style={pageStyle}>
				<h1 style={bannerStyle}>{bannerContent}</h1>
				<div style={{width:'600px',display:'flex',flexDirection:'column',alignItems:'center',marginTop:'20px',justifyContent:'center'}}>
					{ReplayButton}
					{LevelScreenButton}
					{QuitButton}
				</div>
			</div>
		);
	}
}

export default EndPage;
