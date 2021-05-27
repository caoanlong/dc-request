import styled from 'styled-components'

const InputStyle = styled.input`
    width: 100%;
    padding: 0 5px;
    border: 1px solid #ddd;
    outline: none;
`

const Params = ({ params, onAddParams, onDelParams, onChangeParamKey, onChangeParamValue }) => {

    return (
        <div style={{padding: '0 10px'}}>
            <div style={{padding: '10px 0', color: '#999'}}>
                <span>Query Params</span>
                <button 
                    className="btn btn-mini btn-default" 
                    style={{marginLeft: '10px'}} 
                    onClick={onAddParams}>
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
                        params.map((item, i) => (
                            <tr key={i + item.key + item.value}>
                                <td>
                                    <InputStyle type="text" defaultValue={item.key} onChange={(e) => onChangeParamKey(e, i)}/>
                                </td>
                                <td>
                                    <InputStyle type="text" defaultValue={item.value} onChange={(e) => onChangeParamValue(e, i)}/>
                                </td>
                                <td>
                                    {
                                        params.length <= 1 
                                            ? <></> 
                                            : <button 
                                                className="btn btn-mini btn-default" 
                                                onClick={() => onDelParams(i)}>
                                                <span className="icon icon-trash"></span>
                                            </button>
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Params