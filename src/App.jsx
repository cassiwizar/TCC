import { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TextUpdaterNode from './TextUpdaterNode';

const rfStyle = {
  backgroundColor: '#EBECEC',
  backgroundImage: 'radial-gradient(#bbb 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

const initialNodes = [
  {
    id: 'node-1',
    type: 'textUpdater',
    position: { x: 250, y: 5 },
    data: { value: 123 },
  },
  {
    id: 'node-2',
    type: 'textUpdater',
    position: { x: 210, y: 51 },
    data: { value: 123 },
  },
  {
    id: 'node-3',
    type: 'textUpdater',
    position: { x: 220, y: 123 },
    data: { value: 123 },
  },
  {
    id: 'node-4',
    type: 'textUpdater',
    position: { x: 213, y: 10 },
    data: { value: 123 },
  },
];

const nodeTypes = { textUpdater: TextUpdaterNode };

function FlowCanvas() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const reactFlowWrapper = useRef(null);
  const { project } = useReactFlow();

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `node-${+new Date()}`,
        type,
        position,
        data: { value: 'Novo bloco' },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project],
  );

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Barra lateral */}
      <aside
        style={{
          width: '250px',
          background: '#2c3e50',
          color: 'white',
          padding: '1rem',
        }}
      >
        <div
          onDragStart={(event) => {
            event.dataTransfer.setData('application/reactflow', 'textUpdater');
            event.dataTransfer.effectAllowed = 'move';
          }}
          draggable
          style={{
            padding: '0.5rem',
            background: '#1abc9c',
            borderRadius: '4px',
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
          + Bloco
        </div>
      </aside>

      {/* Canvas do React Flow */}
      <div ref={reactFlowWrapper} style={{ flexGrow: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          style={rfStyle}
        />
      </div>
    </div>
  );
}

// Exporta com o provider
export default function Flow() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
