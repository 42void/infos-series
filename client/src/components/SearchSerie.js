import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { getSeriesQuery, getSeriesTitlesQuery } from "../queries/queries";
import { FaSearch } from "react-icons/fa";

class SearchSerie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: '',
      userInput: "",
      showSuggestions: true,
      key:'',
      title:'Star Trek',
      description:`Cette série raconte les aventures vécues, au XXIIIe siècle, par James T. Kirk, capitaine du vaisseau Enterprise NCC-1701 et son équipage. Leur mission quinquennale est d'explorer la galaxie afin d'y découvrir d'autres formes de vie et d'enrichir ainsi les connaissances humaines.`,
      image:"https://pictures.betaseries.com/fonds/poster/d93d98efa85c4d65f754202e691276b9.jpg",
      seasons:"3", 
      episodes:"80", 
      creation:"1966", 
      length:"60", 
      network:"NBC", 
      status:"Série terminée",
      currentFocus:-1,
      submitEnter:0,
    };
  }

  componentDidMount(){
    document.getElementById("myInput").addEventListener("keydown", (e) => {
        if (e.keyCode === 40) { //down
            if(this.state.currentFocus!==11) this.setState({currentFocus : this.state.currentFocus + 1});
        }else if (e.keyCode === 38) { //up
            if(this.state.currentFocus!==-1) this.setState({currentFocus : this.state.currentFocus - 1});
        } else if (e.keyCode === 13) { //enter
            if(this.state.selection !== ""){  
              this.handleSubmit()
              this.setState({submitEnter: 0})
            }
            if (this.state.currentFocus > -1) {
              var tab = this.displayDatas()
              if(tab[this.state.currentFocus]){
                this.setState({submitEnter: this.state.submitEnter+1})
                this.onEnterSerie(tab[this.state.currentFocus].title)
              }
            }
        }
      })

  }

  displayDatas() {
    var counter = -1
    var data = this.props.getSeriesTitlesQuery.series
    var result = [];
    if (data && this.state.selection) { 
      result = data.filter(item => { //array of elements containing the title
        return (
          item.title
            .toLowerCase()
            .indexOf(this.state.selection.toLowerCase()) >= 0
        );
      });
    }
    result = result.sort(function(a, b){ //sort by number of followers
      return b.followers-a.followers
    });
    var selec = this.state.selection
    result.forEach(function(element) {  //put 100% matching result first
      counter++;
      if(element.title.toLowerCase() === selec.toLowerCase()){
        var tmp = result[0]
        result[0] = result[counter]
        result[counter] = tmp
      }
    });
    return result
  }

  onTextChanged = e => {
    const value = e.target.value;
    this.setState({ selection: value, showSuggestions: true, currentFocus:-1 });
  };

  onEnterSerie = serie => {
    this.setState({
      showSuggestions: false,
      selection: serie.trim()
    });
  }

  onSelectSerie = e => {
    document.getElementById('myInput').focus();
    this.setState({
      submitEnter:1,
      showSuggestions: false,
      selection: e.currentTarget.innerText ? e.currentTarget.innerText : document.getElementById("myInput").innerText
    });
  };

  handleSubmit = (e) => {
    var data = this.props.getSeriesQuery.series;
    var result = [];
    if (data && this.state.selection) {
      result = data.filter(item => {
        return (
          item.title.trim().toLowerCase() === this.state.selection.toLowerCase()
        );
      });
    }
    result = result[0]
    if(result) {
      if(result.images.poster !== null){
        document.getElementById("img").style.maxWidth = '32%';
        document.getElementById("img").style.width = null;
        this.setState({image:result.images.poster})
      }else document.getElementById("img").style.width = '0px';
      this.setState({
        title:result.title, 
        description:result.description, 
        seasons:result.seasons, 
        episodes:result.episodes, 
        creation:result.creation, 
        length:result.length, 
        network:result.network, 
        status:result.status,
      })
    }
    return result;
  };

  render() {
    console.log("props",this.props)
    return ( 
      <div style={{flex:1, alignContent:'center'}}>
        <div style={{flex:1}}>
          <div
            style={{
              marginTop: 50,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <div style={{ position: "relative" }}>
              <FaSearch
                style={{
                  color: "#d6d6d6",
                  zIndex: 1,
                  position: "absolute",
                  width: 25,
                  height: 25,
                  right: 8,
                  top: 8
                }}
              />

              <input
                id="myInput"
                value={this.state.selection}
                placeholder="Ex : Star Trek"
                onChange={this.onTextChanged}
                type="text"
                style={{ height: 20, fontSize: 16, padding: 10, width: '40vw', maxWidth:500, borderStyle:'none' }}
              />
            </div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
            <button
              disabled={this.props.getSeriesQuery.loading ? true : false}
              onClick={this.handleSubmit}
              style={{         
                backgroundColor: "#4CAF50",
                color: '#fff',
                height:40,
                width:100,
                fontSize: 16,
                cursor: 'pointer',
                borderStyle:'none',
              }}
            >
              Ok
            </button>
          </div>
          </div>
        
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: 0,
              visibility: this.state.showSuggestions ? "visible" : "hidden",
              marginLeft:-100
            }}
          >
            <ul
              style={{
                margin: 0,
                padding: 0,
                position:'absolute'
              }}
            >
              {!this.props.getSeriesQuery.loading ? this.displayDatas().map((serie, i) => {
                while (i < 12) {
                  return (
                    <li
                      onClick={this.onSelectSerie}
                      style={{
                        margin: 0,
                        display: "flex",
                        padding: 10,
                        alignItems: "center",
                        listStyle: "none",
                        backgroundColor: "#FFF",
                        color: this.state.currentFocus === i ? "#4CAF50" : "",
                        width: '40vw',
                        maxWidth:500,
                        borderStyle: "solid",
                        borderColor: "#b9b9b9",
                        borderWidth: 0.5,
                        fontSize: 16,
                        fontWeight: this.state.currentFocus === i ? 700 : ""
                      }}
                      key={i}
                    >
                      {serie.title}
                    </li>
                  );
                }
              }):null}
            </ul>
          </div>
          
        </div>
        {this.props && this.props.getSeriesQuery.loading ? 
        
        <div className="wrap">
          <div className="loading">
            <div className="bounceball"></div>
            <div className="loadingText">CHARGEMENT...</div>
          </div>
        </div>
        :  
        <div style={{width:'80%', margin:'auto', marginTop: 50}}>
            <img style={{maxWidth:'32%', display:'block', float:'left', marginRight:20}} id="img" src={this.state.image} alt={this.state.title}/>
            <div style={{color:'white', marginTop:60, fontSize:30}}>{this.state.title}</div>
            <div style={{color:'white', marginTop:20, }}>{this.state.description}</div>
            <div style={{color:'white', marginTop:20, }}>Nombre de saisons : {this.state.seasons}</div>
            <div style={{color:'white', marginTop:20, }}>Nombre d'épisodes : {this.state.episodes}</div>
            <div style={{color:'white', marginTop:20, }}>Durée : {this.state.length}mn</div>
            <div style={{color:'white', marginTop:20, }}>Année de création : {this.state.creation}</div>
            <div style={{color:'white', marginTop:20, }}>Diffuseur : {this.state.network}</div>
            <div style={{color:'white', marginTop:20, }}>Status : {this.state.status === "Ended" ? "Série terminée" : "Série diffusée actuellement"}</div>
        </div>
        }
      </div>
    );
  }
}

export default compose(
  graphql(getSeriesQuery, { name: "getSeriesQuery" }),
  graphql(getSeriesTitlesQuery, { name: "getSeriesTitlesQuery" })
)(SearchSerie);
