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

  // Função para adicionar um novo nó ao clicar no botão
  const addNode = () => {
    const newNode = {
      id: `node-${+new Date()}`, // ID único baseado no timestamp
      type: 'textUpdater', // Tipo do nó
      position: { x: Math.random() * 40, y: Math.random() * 40 }, // Posição aleatória
      data: { value: 'Novo bloco' }, // Dados do nó
    };

    setNodes((nds) => [...nds, newNode]); // Adiciona o novo nó ao estado
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Barra lateral */}
      <aside
        style={{
          width: '205px',
          background: '#D9C6F8',
          color: 'black',
          padding: '1rem',
          opacity: '75%'
        }}
      >
        <button
          onClick={addNode}
          style={{
            padding: '0.5rem',
            background: '#FFF',
            borderRadius: '15px',
            cursor: 'pointer',
            color: 'black', 
            fontWeight: 'bolder',
            width: '100%',
            border: '1px solid #9370DB',
            textAlign: 'center', 
          }}
        >
          + Criar Bloco
        </button>
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