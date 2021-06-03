import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import qs from 'qs'
import axios from 'axios'
import Toast from 'light-toast'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import 'jsoneditor/dist/jsoneditor.min.css'
import styled from 'styled-components'
import Params from './components/Params'
import ReqBody from './components/ReqBody'
import Headers from './components/Headers'
import Response from './components/Response'
import { sizeof, sign } from './utils'

const InputStyle = styled.input`
  flex: 1;
  display: block;
  text-align: left;
`
const RequestStyle = styled.div`
  flex: 1;
  overflow: hidden;
  border-bottom: 1px solid #ddd;
  position: relative;
`
const ResponseStyle = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`
const ResStatusStyle = styled.div`
  padding: 0 10px;
  color: #999;
  height: 30px;
  line-height: 30px;
  display: flex;
`

const getDefaultConfig = () => {
  return {
    id: uuidv4(),
    method: 'GET',
    url: '',
    req: 'params',
    params: [{ key: '', value: '' }],
    body: {
      client_type: '11',
      appid: 'BITOLLWALLETDEMO'
    },
    bodyType: 'JSON', // form-data, x-www-form-urlencoded, JSON
    headers: [
      { key: 'content-type', value: 'application/json; charset=UTF-8' }
    ],
    res: '',
    status: '',
    time: 0,
    size: 0
  }
}
const reqs = [
  { label: 'Params', value: 'params' },
  { label: 'Body', value: 'body' },
  { label: 'Headers', value: 'headers' }
]

// 接收主进程传过来的密钥对
window.electron.ipcRenderer.on('rsaKeypair', (e, { privateKey, publicKey }) => {
  localStorage.setItem('privateKey', privateKey)
  localStorage.setItem('publicKey', publicKey)
})
let deviceId = localStorage.getItem('deviceId')
if (!deviceId) {
  FingerprintJS.load().then(fp => {
    fp.get().then(result => {
      deviceId = result.visitorId
      localStorage.setItem('deviceId', deviceId)
    })
  })
}


const EnableSign = ({ isSign, onChange }) => {
  return <label style={{marginLeft: '20px'}}>
    <input 
      style={{position: 'relative', top: '2px', marginRight: '2px'}} 
      type="checkbox" 
      checked={isSign} 
      onChange={onChange}/>
      <span>开启签名</span>
  </label>
}
function App() {
  const [ list, setList ] = useState([getDefaultConfig()])
  const [ itemIndex, setItemIndex ] = useState(0)
  const [ isSign, setIsSign ] = useState(false)

  const send = () => {
    if (!list[itemIndex].url) {
      alert('URL地址不能为空！')
      return
    }
    const config = {
      url: list[itemIndex].url,
      method: list[itemIndex].method,
    }
    // 判断是否有params
    const params = {}
    let hasParams = false
    for (const { key, value } of list[itemIndex].params) {
      if (key && value) {
        params[key] = value
        hasParams = true
      }
    }
    if (list[itemIndex].req === 'params' && hasParams) {
      config.params = params
    }
    // 判断是否有请求体data
    if (list[itemIndex].req === 'body' && list[itemIndex].method === 'POST' && Object.keys(list[itemIndex].body).length > 0) {
      config.data = list[itemIndex].body
      if (isSign) {
        config.data.seq = parseInt(new Date().getTime() * 0.001) + '-' + config.data.retrieve
        config.data.sign_type = 'SHA256WithRSAClient'
        const privateKey = localStorage.getItem('privateKey')
        config.data.sign = sign(privateKey, config.data)
        list[itemIndex].body = config.data
        setList([...list])
      }
    }
    Toast.loading()
    axios(config).then(res => {
      list[itemIndex].status = res.status
      list[itemIndex].res = typeof res.data === 'object' 
        ? JSON.stringify(res.data, null, 4) 
        : res.data
      list[itemIndex].size = sizeof(list[itemIndex].res)
      setList([...list])
      Toast.hide()
    }).catch(err => {
      console.log(err)
      if (!err.response) {
        list[itemIndex].res = err.toJSON().message
        setList([...list])
        Toast.hide()
        return
      }
      // for (const key in err.response) {
      //   console.log(key, err.response[key])
      // }
      list[itemIndex].status = err.response.status
      list[itemIndex].res = typeof err.response.data === 'object' 
        ? JSON.stringify(err.response.data, null, 4) 
        : err.response.data
      list[itemIndex].size = sizeof(list[itemIndex].res)
      setList([...list])
      Toast.hide()
    })
  }
  const onChange = (e) => {
    if (!e.target.value) return
    list[itemIndex].url = e.target.value
    const str = e.target.value.split('?')[1]
    if (!str) return
    const obj = qs.parse(str)
    if (!obj || obj.length === 0) return
    const params = []
    for (const key in obj) {
      params.push({ key, value: obj[key] })
    }
    list[itemIndex].params = params
    setList([...list])
  }

  const addItem = () => {
    setList([ ...list, getDefaultConfig()])
  }
  const delItem = async (id) => {
    await setList(list.filter(it => it.id !== id))
    setItemIndex(0)
  }
  const changeReq = (req) => {
    list[itemIndex].req = req
    setList([...list])
  }
  const changeMethod = (e) => {
    list[itemIndex].method = e.target.value
    setList([...list])
  }
  const handleAddParams = () => {
    list[itemIndex].params = [...list[itemIndex].params, { key: '', value: '' }]
    setList([...list])
  }
  const handleDelParams = (i) => {
    list[itemIndex].params = list[itemIndex].params.filter((param, idx) => idx !== i)
    const params = {}
    for (const { key, value } of list[itemIndex].params) {
      params[key] = value
    }
    const str = qs.stringify(params)
    list[itemIndex].url = list[itemIndex].url.split('?')[0] + '?' + str
    setList([...list])
  }
  const handleChangeParamKey = (e, i) => {
    list[itemIndex].params[i].key = e.target.value
  }
  const handleChangeParamValue = (e, i) => {
    list[itemIndex].params[i].value = e.target.value
  }

  const handleSetBody = (body) => {
    list[itemIndex].body = body
  }

  const handleAddHeaders = () => {
    list[itemIndex].headers = [...list[itemIndex].headers, { key: '', value: '' }]
    setList([...list])
  }
  const handleDelHeaders = (i) => {
    list[itemIndex].headers = list[itemIndex].headers.filter((header, idx) => idx !== i)
    setList([...list])
  }
  const handleChangeHeaderKey = (e, i) => {
    list[itemIndex].headers[i].key = e.target.value
  }
  const handleChangeHeaderValue = (e, i) => {
    list[itemIndex].headers[i].value = e.target.value
  }

  const handleSignChange = (e) => {
    setIsSign(e.target.checked)
  }

  const Request = () => {
    if (list[itemIndex].req === 'params') {
      return (
        <Params 
          params={list[itemIndex].params} 
          onAddParams={handleAddParams} 
          onDelParams={handleDelParams} 
          onChangeParamKey={handleChangeParamKey}
          onChangeParamValue={handleChangeParamValue}>
        </Params>
      )
    } else if (list[itemIndex].req === 'body') {
      return (<ReqBody body={list[itemIndex].body} setBody={handleSetBody}></ReqBody>)
    } else {
      return (
        <Headers 
          headers={list[itemIndex].headers} 
          onAddHeaders={handleAddHeaders} 
          onDelHeaders={handleDelHeaders} 
          onChangeHeaderKey={handleChangeHeaderKey} 
          onChangeHeaderValue={handleChangeHeaderValue}>
        </Headers>)
    }
  }

  return (
    <div className="window">
      <div className="tab-group">
        {
          list.map((it, idx) => (
            <div 
              className={itemIndex === idx ? 'tab-item active' : 'tab-item'} 
              key={it.id} 
              onClick={() => setItemIndex(idx)}>
              { 
                list.length === 1 
                  ? <></> 
                  : <span 
                    className="icon icon-cancel icon-close-tab" 
                    onClick={() => { delItem(it.id) }}>
                  </span> 
              }
              { it.method }
            </div>
          ))
        }
        <div className="tab-item tab-item-fixed" onClick={addItem}>
          <span className="icon icon-plus"></span>
        </div>
      </div>
      <div className="toolbar-actions" style={{width: '100%'}}>
        <div className="btn-group" style={{display: 'flex'}}>
          <select 
            className="btn btn-large btn-default" 
            style={{width: '80px'}} 
            value={list[itemIndex].method}
            onChange={changeMethod}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
          <InputStyle 
            className="btn btn-large btn-default" 
            type="text" 
            placeholder="请输入URL" 
            defaultValue={list[itemIndex].url}
            key={itemIndex + list[itemIndex].url}
            onChange={onChange}>
          </InputStyle>
          <button 
            className="btn btn-large btn-primary" 
            style={{width: '80px'}} 
            onClick={send}>
            发送
          </button>
        </div>
        <div className="btn-group" style={{margin: '10px 4px'}}>
          {
            reqs.map(req => (
              <button 
                className={list[itemIndex].req === req.value ? 'btn btn-default active' : 'btn btn-default'} 
                key={req.value}
                onClick={() => { changeReq(req.value) }}>
                {req.label}
              </button>
            ))
          }
          <EnableSign isSign={isSign} onChange={handleSignChange}></EnableSign>
        </div>
      </div>
      <RequestStyle>
        <Request></Request>
      </RequestStyle>
      <ResponseStyle>
        <ResStatusStyle>
          <div style={{flex: '1'}}>Body</div>
          <div style={{width: '100px'}}>Status: {list[itemIndex].status}</div>
          <div style={{width: '100px'}}>Size: {list[itemIndex].size}B</div>
        </ResStatusStyle>
        <Response res={list[itemIndex].res}></Response>
      </ResponseStyle>
    </div>
  )
}

export default App
