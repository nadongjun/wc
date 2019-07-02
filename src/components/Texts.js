import React from 'react';
import TextTruncate from 'react-text-truncate';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';//문자열
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import {Link as RouterLink} from 'react-router-dom'

const databaseURL = "https://word-cloud-e6b0f.firebaseio.com/";

const styles = theme => ({//스타일 정의
    hidden: {
        display: 'none'
    },
    fab: {//동그란 버튼
        position: 'fixed',
        bottom: '20px',
        right: '20px'
    }
});

class Texts extends React.Component {

    constructor(props) {//생성자
        super(props);
        this.state = {//파일 업로드
            fileName:'',
            fileContent: null,
            texts: {},
            textName: '',
            dialog: false
        }
    }
    //Model
    _get() {//txt database 접속한 후 데이터를 가져오는 함수
        fetch(`${databaseURL}/texts.json`).then(res => {
            if(res.status != 200) {
                throw new ERROR(res.statusText);
            }
            return res.json();
        }).then(texts => this.setState({texts: (texts == null) ? {}: texts}));
    }
    _post(text) {//database에 데이터를 삽입하는 함수
        //텍스트 데이터 등록
        return fetch(`${databaseURL}/texts.json`, {
            method: 'POST',
            body: JSON.stringify(text)
        }).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(data => {
            let nextState = this.state.texts;
            nextState[data.name] = text;
            this.setState({texts: nextState});
        });
    }

    _delete(id) {
        return fetch(`${databaseURL}/texts/${id}.json`,{
            method: 'DELETE'
        }).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(() => {//삭제한 데이터를 화면에 보여준다.
            let nextState = this.state.texts;
            delete nextState[id];
            this.setState({texts: nextState});
        })
    }
    componentDidMount() {//컴포넌트가 다 만들어졌을 때 get 함수를 호출한다.
        this._get();
    }
    handleDialogToggle = () => this.setState({//업로드 이후 버튼 눌렀을 때 갱신
        dialog: !this.state.dialog,
        fileName: '',
        fileContent: '',
        textName: ''//다른 파일을 업로드할 때 이전 파일 정보 초기화
    })
    handleValueChange = (e) => {//입력할때마다 호출되어 화면 갱신
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    handleSubmit = () => {//입력버튼
        const text = {//입력할 내용은 텍스트 이름과 내용으로 구별되어짐
            textName: this.state.textName,
            textContent: this.state.fileContent
        }
        this.handleDialogToggle();
        if(!text.textName && !text.textContent) {
            return;
        }//정상적으로 들어올 경우에 post 호출하여 전달
        this._post(text);
    }
    handleDelete = (id) => {//사용자가 삭제 버튼을 눌렀을 때 특정 id를 삭제한다.
        this._delete(id);
    }
    //////////////////////////////////////////
    handleFileChange = (e) => {
        let reader = new FileReader();
        reader.onload = () => {
            let text = reader.result;
            this.setState ({
                fileContent: text
            });

        }
        reader.readAsText(e.target.files[0], "EUC-KR");
        this.setState({
            fileName: e.target.value
        })
    }
    //파일이 바뀐경우
    /////////////////////////////////////////
    //view, const 변수 여러개의 원소가 들어가는 경우 div로 감싸줘야 한다.
    render() {
        const { classes } = this.props;
        return (
            <div>
                {Object.keys(this.state.texts).map(id => {
                const text = this.state.texts[id];
                return (
                    <div key={id}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterButton>
                                    내용: {text.textContent.substring(0, 24) + "..."}
                                </Typography>
                             <Grid container>
                                <Grid item xs = {6}>
                                    <Typography variant="h5" component="h2">
                                        {text.textName.substring(0, 14) + ""}
                                    </Typography>
                                </Grid>
                                <Grid item xs = {3}>    
                                        <Typography variant="h5" component="h2">
                                    <Link component={RouterLink} to={"detail/" + id}>
                                        <Button variant="contained" color="primary">보기</Button>
                                    </Link>
                                    </Typography>                           
                                </Grid>
                                <Grid item xs = {3}> 
                                     <Button variant="contained" color="primary" onClick={() => this.handleDelete(id)}>삭제</Button>                
                                </Grid>
                            </Grid>

                        </CardContent>
                    </Card>
                </div>
                );
            })}
                <Fab color="primary" className={ classes.fab } onClick={this.handleDialogToggle}>
                    <AddIcon />
                </Fab>
                <Dialog open={this.state.dialog} onClose={this.handleDialogToggle}>
                    <DialogTitle>텍스트 추가</DialogTitle>
                    <DialogContent>
                        <TextField label="텍스트 이름" type="text" name="textName" value={this.state.textName} onChange={this.handleValueChange}/><br/><br/>
                        <input className={classes.hidden} accept="text/plain" id="raised-button-file" type="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange} />
                        <label htmlFor="raised-button-file">
                            <Button variant="contained" color="primary" component="span" name="file">
                                {this.state.fileName === "" ? ".txt파일 선택" : this.state.fileName}
                            </Button>
                        </label>
                        <TextTruncate 
                            line={1}
                            truncateText="..."
                            text={this.state.fileContent}
                        />
                       
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleSubmit}>추가</Button>            
                        <Button variant="outlined" color="primary" onClick={this.handleDialogToggle}>닫기</Button>   
                    </DialogActions>
                </Dialog>
             </div>
        );
    }
}

export default withStyles(styles)(Texts);