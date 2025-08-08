import { NextResponse } from 'next/server';
import { ImprovedSimulationMaster } from '@/lib/improved-simulation-master-clean';

// Global simulation master instance
let simulationMaster = null;

function getSimulationMaster() {
  if (!simulationMaster) {
    simulationMaster = new ImprovedSimulationMaster();
  }
  return simulationMaster;
}

export async function POST(request) {
  try {
    const { action, ...params } = await request.json();
    const master = getSimulationMaster();

    switch (action) {
      case 'start_simulation':
        return await handleStartSimulation(master, params);
      
      case 'execute_action':
        return await handleExecuteAction(master, params);
      
      case 'get_status':
        return await handleGetStatus(master, params);
      
      case 'end_simulation':
        return await handleEndSimulation(master, params);
      
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Simulation master error:', error);
    return NextResponse.json(
      { success: false, message: 'Simulation processing failed', error: error.message },
      { status: 500 }
    );
  }
}

async function handleStartSimulation(master, { roleType, difficulty, userProfile }) {
  if (!roleType) {
    return NextResponse.json(
      { success: false, message: 'Role type is required' },
      { status: 400 }
    );
  }

  try {
    const result = await master.startSimulation(
      roleType, 
      difficulty || 'intermediate', 
      userProfile || {}
    );

    return NextResponse.json({
      success: true,
      simulation: result,
      message: 'Simulation started successfully'
    });
  } catch (error) {
    console.error('Start simulation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to start simulation', error: error.message },
      { status: 500 }
    );
  }
}

async function handleExecuteAction(master, { simulationId, userAction, currentState }) {
  if (!simulationId || !userAction) {
    return NextResponse.json(
      { success: false, message: 'Simulation ID and user action are required' },
      { status: 400 }
    );
  }

  try {
    const result = await master.executeSimulation(simulationId, userAction, currentState);

    return NextResponse.json({
      success: true,
      response: result,
      message: 'Action executed successfully'
    });
  } catch (error) {
    console.error('Execute action error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to execute action', error: error.message },
      { status: 500 }
    );
  }
}

async function handleGetStatus(master, { simulationId }) {
  if (!simulationId) {
    return NextResponse.json(
      { success: false, message: 'Simulation ID is required' },
      { status: 400 }
    );
  }

  try {
    const status = master.getSimulationStatus(simulationId);
    
    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Simulation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      status,
      message: 'Status retrieved successfully'
    });
  } catch (error) {
    console.error('Get status error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get status', error: error.message },
      { status: 500 }
    );
  }
}

async function handleEndSimulation(master, { simulationId }) {
  if (!simulationId) {
    return NextResponse.json(
      { success: false, message: 'Simulation ID is required' },
      { status: 400 }
    );
  }

  try {
    const report = await master.endSimulation(simulationId);

    return NextResponse.json({
      success: true,
      report,
      message: 'Simulation ended and report generated'
    });
  } catch (error) {
    console.error('End simulation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to end simulation', error: error.message },
      { status: 500 }
    );
  }
}