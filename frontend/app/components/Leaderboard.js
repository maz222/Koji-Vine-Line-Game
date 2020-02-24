import { h, Component } from 'preact';
import Koji from '@withkoji/vcc';
import HoverButton from './ReactButtons.js';


class Leaderboard extends Component {
  state = {
    scores: [],
    dataIsLoaded: false,
    error: false,
  };

  componentWillMount() {
    fetch(`${Koji.config.serviceMap.backend}/leaderboard`)
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
    const VCC = Koji.config.leaderboard;
    if (this.state.error) {
      return (
        <div id={'leaderboard'} style={{ backgroundColor: VCC.background.backgroundColor, color:'black' }}>
          <div className={'leaderboard-loading'}>
            <div>{'Error!'}</div>
            <button onClick={() => window.setAppView('intro')}>
              {'Back to Title'}
            </button>
          </div>
        </div>
      );
    }

    if (!this.state.dataIsLoaded) {
      return (
        <div id={'leaderboard'} style={{ backgroundColor: VCC.background.backgroundColor}}>
          <div className={'leaderboard-loading'}>
            <div style="display: flex; margin-top: 20vh; justify-content: center; text-align: center; animation-name: logo; animation-duration: 2s; animation-iteration-count: infinite; animation-timing-function: ease-out;">
              <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
          </div>
        </div>
      );
    }

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

    let bannerColor = VCC.banner.backgroundColor;
    let bannerStyle = {
        width:'calc(100% - 40px)',
        padding:'20px',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center',
        position:'fixed',
        height:'40px',
        backgroundColor:bannerColor,
        top:'0px',
        borderBottom:'1px solid rgba(0,0,0,.25)'
    };

    let backStyle = {
        postion:'relative',
        left:'-40%',
        padding:'10px',
        border:0,
        backgroundColor:bannerColor,
        borderRadius:'2px'
    };
    let backImage = <img src={Koji.config.gameScene.backButton.buttonImage} style={{height:'30px',width:'auto'}} />
    let BackButton = <HoverButton styling={backStyle} content={backImage} callback={() => window.setAppView('intro')}/>

    let title = VCC.banner.content;
    let titleColor = VCC.banner.textColor;
    let titleStyle = {
        color:titleColor
    };
    
    let entryStyle = {
      backgroundColor:VCC.scoreEntry.backgroundColor,
      padding:'10px',
      display:'flex',
      justifyContent:'space-between',
      alignItems:'center',
      margin:'10px'
    };
    let entryTextStyle= {
      color:VCC.scoreEntry.color,
      fontSize:'1.25em'
    };
    return (
      <div style={pageStyle}>
        <div style={bannerStyle}>
          {BackButton}
          <h1 style={titleStyle}>{title}</h1>
          <div />
        </div>
        <div style={{width:'100%',display:'flex',flexDirection:'column',marginTop:'80px'}}>
          {
            this.state.scores.slice(0,100).map((score,index) => {
              return(
                <div style={entryStyle}><p style={entryTextStyle}>{`${index + 1}. ${score.name}`}</p><p style={entryTextStyle}>{score.score}</p></div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default Leaderboard;
