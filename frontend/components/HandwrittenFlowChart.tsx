'use client'

import React from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow'
import 'reactflow/dist/style.css'

const initialNodes = [
  { id: 'entry', data: { label: 'User interacts with chatbot' }, position: { x: 500, y: 0 } },
  { id: 'intent', data: { label: 'What does the user want to do?' }, position: { x: 480, y: 80 } },
  { id: 'upload', data: { label: 'Upload File' }, position: { x: 150, y: 160 } },
  { id: 'uploadSuccess', data: { label: 'Upload Successful?' }, position: { x: 150, y: 240 } },
  { id: 'analyzeFile', data: { label: 'Analyse File in VirusTotal Sandbox' }, position: { x: 150, y: 320 } },
  { id: 'isFileMalicious', data: { label: 'Is File Malicious?' }, position: { x: 150, y: 400 } },
  { id: 'classifyMalicious', data: { label: 'Classify as Malicious' }, position: { x: 50, y: 480 } },
  { id: 'classifySafe', data: { label: 'Classify as Safe' }, position: { x: 250, y: 480 } },
  { id: 'showResult', data: { label: 'Show Result' }, position: { x: 150, y: 540 } },
  { id: 'scanUrl', data: { label: 'Scan URL' }, position: { x: 500, y: 160 } },
  { id: 'detectUrl', data: { label: 'VirusTotal/Phishing Detection' }, position: { x: 500, y: 240 } },
  { id: 'isUrlDangerous', data: { label: 'URL Dangerous?' }, position: { x: 500, y: 320 } },
  { id: 'flagUrl', data: { label: 'Flag URL as Dangerous' }, position: { x: 400, y: 400 } },
  { id: 'markSafe', data: { label: 'Mark URL as Safe' }, position: { x: 600, y: 400 } },
  { id: 'displayResult', data: { label: 'Display Result' }, position: { x: 500, y: 480 } },
  { id: 'extension', data: { label: 'Install Extension' }, position: { x: 850, y: 160 } },
  { id: 'monitoring', data: { label: 'Background Link Monitoring' }, position: { x: 850, y: 240 } },
  { id: 'threatDetected', data: { label: 'Threat Detected' }, position: { x: 850, y: 320 } },
  { id: 'triggerAlert', data: { label: 'Trigger Real-time Alert' }, position: { x: 850, y: 400 } },
  { id: 'noThreat', data: { label: 'No threat detected' }, position: { x: 1000, y: 320 } },
  { id: 'continueBrowsing', data: { label: 'Continue Browsing Silently' }, position: { x: 1000, y: 400 } },
  { id: 'chooseSim', data: { label: 'Choose Simulation Type' }, position: { x: 700, y: 160 } },
  { id: 'phishEmail', data: { label: 'Simulated Phishing Email Scenario' }, position: { x: 580, y: 240 } },
  { id: 'vishCall', data: { label: 'Simulated Vishing Call Scenario' }, position: { x: 700, y: 240 } },
  { id: 'smishText', data: { label: 'Simulated Smishing Text Scenario' }, position: { x: 820, y: 240 } },
  { id: 'interactSim', data: { label: 'User Interacts with Simulation' }, position: { x: 700, y: 320 } },
  { id: 'isSafe', data: { label: 'Is Interaction Safe?' }, position: { x: 700, y: 400 } },
  { id: 'positive', data: { label: 'Provide Positive Feedback' }, position: { x: 600, y: 480 } },
  { id: 'feedback', data: { label: 'Feedback and Education on Risks' }, position: { x: 800, y: 480 } },
  { id: 'return', data: { label: 'Return to Main Menu' }, position: { x: 500, y: 600 } },
]

const initialEdges = [
  { id: 'e1', source: 'entry', target: 'intent' },
  { id: 'e2', source: 'intent', target: 'upload' },
  { id: 'e3', source: 'upload', target: 'uploadSuccess' },
  { id: 'e4', source: 'uploadSuccess', target: 'analyzeFile', label: 'Yes' },
  { id: 'e5', source: 'analyzeFile', target: 'isFileMalicious' },
  { id: 'e6', source: 'isFileMalicious', target: 'classifyMalicious', label: 'Yes' },
  { id: 'e7', source: 'isFileMalicious', target: 'classifySafe', label: 'No' },
  { id: 'e8', source: 'classifyMalicious', target: 'showResult' },
  { id: 'e9', source: 'classifySafe', target: 'showResult' },
  { id: 'e10', source: 'showResult', target: 'return' },
  { id: 'e11', source: 'uploadSuccess', target: 'return', label: 'No' },

  { id: 'e12', source: 'intent', target: 'scanUrl' },
  { id: 'e13', source: 'scanUrl', target: 'detectUrl' },
  { id: 'e14', source: 'detectUrl', target: 'isUrlDangerous' },
  { id: 'e15', source: 'isUrlDangerous', target: 'flagUrl', label: 'Yes' },
  { id: 'e16', source: 'isUrlDangerous', target: 'markSafe', label: 'No' },
  { id: 'e17', source: 'flagUrl', target: 'displayResult' },
  { id: 'e18', source: 'markSafe', target: 'displayResult' },
  { id: 'e19', source: 'displayResult', target: 'return' },

  { id: 'e20', source: 'intent', target: 'extension' },
  { id: 'e21', source: 'extension', target: 'monitoring' },
  { id: 'e22', source: 'monitoring', target: 'threatDetected' },
  { id: 'e23', source: 'monitoring', target: 'noThreat' },
  { id: 'e24', source: 'threatDetected', target: 'triggerAlert' },
  { id: 'e25', source: 'noThreat', target: 'continueBrowsing' },
  { id: 'e26', source: 'triggerAlert', target: 'return' },
  { id: 'e27', source: 'continueBrowsing', target: 'return' },

  { id: 'e28', source: 'intent', target: 'chooseSim' },
  { id: 'e29', source: 'chooseSim', target: 'phishEmail' },
  { id: 'e30', source: 'chooseSim', target: 'vishCall' },
  { id: 'e31', source: 'chooseSim', target: 'smishText' },
  { id: 'e32', source: 'phishEmail', target: 'interactSim' },
  { id: 'e33', source: 'vishCall', target: 'interactSim' },
  { id: 'e34', source: 'smishText', target: 'interactSim' },
  { id: 'e35', source: 'interactSim', target: 'isSafe' },
  { id: 'e36', source: 'isSafe', target: 'positive', label: 'Yes' },
  { id: 'e37', source: 'isSafe', target: 'feedback', label: 'No' },
  { id: 'e38', source: 'positive', target: 'return' },
  { id: 'e39', source: 'feedback', target: 'return' },
]

export function HandwrittenFlowChart() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  return (
    <div className="w-full h-[800px] rounded-lg border border-neon-purple overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        style={{
          background: '#0f0f0f',
          fontFamily: 'cursive',
          color: '#fff',
        }}
      >
        <Background color="#444" gap={16} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  )
}
