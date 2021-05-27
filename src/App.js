import styled from 'styled-components'
import Params from './components/Params'
import Response from './components/Response'

const InputStyle = styled.input`
  flex: 1;
  display: block;
  text-align: left;
`
const RequestStyle = styled.div`
  flex: 1;
  overflow: hidden auto;
  border-bottom: 1px solid #ddd;
  position: relative;
`
const ResponseStyle = styled.div`
  flex: 1;
  overflow: hidden auto;
  position: relative;
`

function App() {
  
  return (
    <div className="window">
      <div className="tab-group">
        <div className="tab-item active">
          <span className="icon icon-cancel icon-close-tab"></span>
          GET
        </div>
        <div className="tab-item">
          <span className="icon icon-cancel icon-close-tab"></span>
          POST
        </div>
        <div className="tab-item">
          <span className="icon icon-cancel icon-close-tab"></span>
          POST
        </div>
        <div className="tab-item tab-item-fixed">
          <span className="icon icon-plus"></span>
        </div>
      </div>
      <div className="toolbar-actions" style={{width: '100%'}}>
        <div className="btn-group" style={{display: 'flex'}}>
          <select className="btn btn-large btn-default" style={{width: '70px'}}>
            <option>GET</option>
            <option>POST</option>
          </select>
          <InputStyle className="btn btn-large btn-default" type="text" placeholder="请输入URL" />
          <button className="btn btn-large btn-primary" style={{width: '80px'}}>发送</button>
        </div>
        <div className="btn-group" style={{margin: '10px 4px'}}>
          <button className="btn btn-default active">
            Params
          </button>
          <button className="btn btn-default">
            Body
          </button>
          <button className="btn btn-default">
            Headers
          </button>
        </div>
      </div>
      <RequestStyle>
        <div style={{padding: '0 10px', color: '#999'}}>Query Params</div>
        <Params></Params>
      </RequestStyle>
      <ResponseStyle>
        <div style={{padding: '0 10px', color: '#999'}}>Body</div>
        <Response></Response>
      </ResponseStyle>
    </div>
  )
}

export default App
