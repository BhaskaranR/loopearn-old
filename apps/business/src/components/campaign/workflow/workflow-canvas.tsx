"use client";

import {
  Background,
  Controls,
  Panel,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import type { Connection, Edge, Node } from "@xyflow/react";
import { useCallback } from "react";
import { EmptyWorkflow } from "./empty-workflow";
import "@xyflow/react/dist/style.css";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

interface WorkflowCanvasProps {
  className?: string;
}

export function WorkflowCanvas({ className }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges],
  );

  return (
    <div className={`h-[calc(100vh-5rem)] w-full ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        {nodes.length === 0 && (
          <Panel className="w-full h-full flex items-center justify-center">
            <EmptyWorkflow />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
