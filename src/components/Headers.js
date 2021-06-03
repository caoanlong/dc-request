import styled from 'styled-components'

const HeadersStyle = styled.div`
    padding: 0 10px;
    height: 100%;
    overflow: hidden auto;
`
const InputStyle = styled.input`
    width: 100%;
    padding: 0 5px;
    border: 1px solid #ddd;
    outline: none;
`

const Headers = ({ headers, onAddHeaders, onDelHeaders, onChangeHeaderKey, onChangeHeaderValue }) => {
    return (
        <HeadersStyle>
            <div style={{padding: '10px 0', color: '#999'}}>
                <span>Headers</span>
                <button 
                    className="btn btn-mini btn-default" 
                    style={{marginLeft: '10px'}} 
                    onClick={onAddHeaders}>
                    <span className="icon icon-plus"></span>
                    <span>添加</span>
                </button>
            </div>
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Value</th>
                        <th style={{width: '60px'}}></th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        headers.map((item, i) => (
                            <tr key={i + item.key + item.value}>
                                <td>
                                    <InputStyle type="text" defaultValue={item.key} onChange={(e) => onChangeHeaderKey(e, i)}/>
                                </td>
                                <td>
                                    <InputStyle type="text" defaultValue={item.value} onChange={(e) => onChangeHeaderValue(e, i)}/>
                                </td>
                                <td>
                                    <button 
                                        className="btn btn-mini btn-default" 
                                        onClick={() => onDelHeaders(i)}>
                                        <span className="icon icon-trash"></span>
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </HeadersStyle>
    )
}

export default Headers