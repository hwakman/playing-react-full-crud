import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default class App extends Component {
  constructor(){
    super();
    this.state = {
      showTool : true,
      data: []
    }
    this.toggleShowMenu = this.toggleShowMenu.bind(this);
    this.addNewPost = this.addNewPost.bind(this);
    this.reload = this.reload.bind(this);
    this.deleteProps = this.deleteProps.bind(this);
  }

  // toogle show or hide menu
  toggleShowMenu = () => {
    this.setState({
      showTool:!this.state.showTool
    });
  }

  // for create new prop from cookie
  addNewPost = value => {
    console.log(JSON.stringify(value),typeof(JSON.stringify(value)));
    if(document.cookie.split(';').length <= 0 || document.cookie.length <= 0){
      document.cookie = '1='+JSON.stringify(value);
    } else {
      document.cookie = (document.cookie.split(';').length + 1)+'='+JSON.stringify(value);
    }
    this.reload();
  }

  // for reload document
  reload = () => {
    let arrTemp = []
    let arrTemp2 = []
    let objTemp = [];
    if(document.cookie.length > 0){
      document.cookie.split(';').map(data => arrTemp.push(data));
      arrTemp.map(data => arrTemp2.push(data.substring(data.indexOf('{'),data.length)));
      arrTemp2.map(data => objTemp.push(
        JSON.parse(data)
      ))
    }
    console.log(objTemp);
    
    this.setState({
      data:objTemp
    });
  }

  // for delete props
  deleteProps = value => {
    const target = this.goToProp(value);
    document.cookie = target + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    this.reload();
  }

  // for edit props
  editProps = value => {
    const target = this.goToProp(value.key);
    const dateNow = Date();
    const keyCookie = target.replace(' ','').substring(0,1);
    let newCookie = keyCookie + '={"topic":"' + value.topic + '","content":"'+ value.content +'"';
    newCookie += ',"date":"Edit time : ' + dateNow.toString().substring(dateNow.toString().length - 26,0) + '"}'
    document.cookie = newCookie;
    this.reload();
  }

  // for return cookie position
  goToProp = value => {
    return document.cookie.split(';')[((document.cookie.split(';').length - 1) - value)];
  }

  // Document start function
  componentWillMount() {
    this.reload();
  }

  render(){
    return(
      <div className="container-fluid">
        <nav className="navbar d-flex mb-3">
          <button className="btn btn-white text-white">Home</button>
          <button className="btn btn-white text-white">Logout</button>
        </nav>

        <div className="row">
          <div className="container" style={{maxWidth:"30em"}}>
            {this.state.showTool ? 
              <PostTool hide={this.toggleShowMenu} post={this.addNewPost}/> :
              <div className="col-12 p-3 mb-3 bg-light rounded text-dark d-flex justify-content-end">
                <button className="btn btn-sm btn-white" onClick={this.toggleShowMenu}>Show</button>
              </div>
            }

            <div className="col-12 p-3">
              {this.state.data.slice(0).reverse().map((data,key) =>
                <PostContent key={key} propsKey={key} topic={data.topic} content={data.content} dateNow={data.date} edit={this.editProps} delete={this.deleteProps.bind(this,key)}/>
              )}
              {/* <PostContent topic="First Topic" content="Hello World!" /> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class PostContent extends Component {
  constructor(){
    super()
    this.topicRef = React.createRef();
    this.contentRef = React.createRef();
    this.state = {
      isEdit:false,
      isCloseProps:false,
      topic: '',
      content: ''
    }
    this.toggleEdit = this.toggleEdit.bind(this);
    this.commitEdit = this.commitEdit.bind(this);
    this.closeProps = this.closeProps.bind(this);
  }

  // show or hide edit form
  toggleEdit = () => {
    this.setState({
      isEdit: !this.state.isEdit
    })
  }

  // set index for each props
  numFormat = (e = 0) => {
    const temp = (e + 1).toString();
    switch(temp.length){
      case 1:
      return '00' + temp;
      case 2:
      return '0' + temp;
      default:
      return temp.substring(3)
    }
  }

  // send result to parent props
  commitEdit = () => {
    const key = this.props.propsKey;
    const topic = this.topicRef.current.value;
    const content = this.contentRef.current.value;
    this.props.edit({topic,content,key});
    this.setState({
      isEdit: false
    })
    
  }

  // set default props value
  componentDidMount = () => {
    this.setState({
      topic: this.props.topic,
      content: this.props.content
    })
  }

  closeProps = () => {
    this.setState({
      isCloseProps:!this.state.isCloseProps
    })
  }

  render(){
    const props = this.props;
    const Content = () => {
      return(
        <React.Fragment>
        <span className="col-12 d-flex justify-content-between align-items-center">
        <small>[ {this.numFormat(props.propsKey)} ] </small>
          <small className="h4">{props.topic ? props.topic : "Add topic here."}</small>
          <button className="btn btn-white btn-sm" onClick={this.closeProps.bind(this)}>close</button>
        </span>
        <span className="col-12 d-flex justify-content-between" style={{minHeight:"8em"}}>
          <textarea disabled value={props.content} className="form-control" style={{resize:"none"}} />
        </span>
        <span className="col-12 d-flex mb-2">
          <small>{props.dateNow ? props.dateNow : "Example"}</small>
        </span>
        <span className="col-12 d-flex mb-1 justify-content-end">
          <span>
            <button className="btn btn-sm btn-white mr-2" onClick={this.toggleEdit}>Edit</button>
            <button className="btn btn-sm btn-white text-danger" onClick={props.delete}>Delete</button>
          </span>
        </span>

        </React.Fragment>
      )
    };
    const EditForm = () => {
      return(
        <React.Fragment>
        <span className="col-12 mb-2 d-flex justify-content-between">
          <input className="form-control" defaultValue={props.topic} ref={this.topicRef} />
        </span>
        <span className="col-12 mb-2 d-flex justify-content-between" style={{minHeight:"8em"}}>
          <textarea defaultValue={props.content} className="form-control"  ref={this.contentRef} style={{resize:"none"}} />
        </span>
        <span className="col-12 mb-2 d-flex justify-content-end">
          <button className="btn btn-sm btn-white mr-2" onClick={this.commitEdit} >Commit</button>
          <button className="btn btn-sm btn-white" onClick={this.toggleEdit}>Cancle</button>
        </span>
        </React.Fragment>
      )
    }
    return(
      <div className="row bg-light text-dark mb-3 p-2 rounded" style={this.state.isCloseProps ? {display:"none"}:{display:"block"}}>
        {this.state.isEdit ?
          <EditForm />
          :
          <Content />
        }
      </div>
    )
  }
}

class PostTool extends Component {
  constructor(){
    super();

    this.topicRef = React.createRef();
    this.contentRef = React.createRef();

    this.state = {
      topic: '',
      content : '',
      data : []
    }
    this.addPostContent = this.addPostContent.bind(this);
    this.changeTopic = this.changeTopic.bind(this);
    this.changeContent = this.changeContent.bind(this);
    this.reload = this.reload.bind(this);
  }

  changeTopic = e => {
    this.setState({
      topic:e.target.value
    });
  }

  changeContent = e => {
    this.setState({
      content:e.target.value
    });
  }

  addPostContent = e => {
    const dateNow = Date();
    const topic = this.state.topic;
    const content = this.state.content;
    
    if((topic !== '' && content !== '')) {
      this.setState({
        data:{
          topic: topic,
          content: content,
          date: 'Post time : ' + dateNow.toString().substring(dateNow.toString().length - 25,0)
        }
      },() => {
       this.props.post(this.state.data);
       this.reload();
      });
      this.topicRef.current.value = '';
      this.contentRef.current.value = '';
      this.topicRef.current.focus();
    } else if (topic === '') {
      alert('Please input some thing!');
      this.topicRef.current.focus();
    } else if (content === '') {
      alert('Please input some thing!');
      this.contentRef.current.focus();
    }
  }

  reload = () => {
    this.setState({
      topic:'',
      content:'',
      data:[]
    })
  }
  render() {
    return(
      <div className="col-12 p-3 mb-3 bg-light rounded text-dark">
        <span className=" form-group">
          <span className="mb-2 d-flex justify-content-between">
            <small className="h5">New Post</small>
            <button className="btn btn-white btn-sm" onClick={this.props.hide}>Hide</button>
          </span>
          <input className="form-control col-6 mb-2" maxLength={15} type="text" placeholder="Topic" onChange={this.changeTopic} ref={this.topicRef} />
          <textarea className="form-control mb-2" maxLength={255} rows="5" style={{resize:"none"}} placeholder="Contetnt" onChange={this.changeContent} ref={this.contentRef} />
          <button className="btn btn-primary" onClick={this.addPostContent}>Post content</button>
        </span>
      </div>
    )
  }
}