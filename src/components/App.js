import React from 'react';
import AppShell from './AppShell';
import { HashRouter as Router, Route } from 'react-router-dom'; 
import Home from './Home';
import Texts from './Texts';
import Words from './Words';
//사용자에게 보여주는 화면
class App extends React.Component {
    render() {//Router 안에 포함된 Appshell
        return (//AppShell에서 어떤 페이지를 보여줄건지 설정 할 수 있다.
                //AppShell에서 페이지가 출력된다.
            <Router>
                <AppShell>
                    <div>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/texts" component={Texts}/>
                        <Route exact path="/words" component={Words}/>

                    </div>
                </AppShell>
            </Router>
        );
    }
}
export default App;