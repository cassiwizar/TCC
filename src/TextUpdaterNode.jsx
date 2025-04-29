//bloco com texto
import { useCallback } from 'react';
import { Background, Handle, Position } from '@xyflow/react';
 
const nodeStyle = {
  padding: '10px',
  background: 'white',
  border: '1px solid #ccc',
  borderRadius: '15px',
  width: '220px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  fontFamily: 'sans-serif',
  fontSize: '14px',
  paddingBottom: '25px',
};
const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  marginTop: '10px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: 'none',
  borderRadius: '9999px', 
  backgroundColor: '#ddd',
  fontSize: '14px',
  boxSizing: 'border-box',
  outline: 'none',
};
 
function TextUpdaterNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <div className="text-updater-node" style={nodeStyle}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <label htmlFor="text" style={labelStyle}>Texto:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag"  style={inputStyle} />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}
 
export default TextUpdaterNode;