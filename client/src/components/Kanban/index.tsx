import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { Segment } from 'semantic-ui-react';
import { IPitch } from 'ssw-common';

import { getNearestIssue, isError } from '../../api';
import { getPitchBuckets, updateIssueStatus } from '../../api/issue';
import { issueStatusEnum } from '../../utils/enums';
import { titleCase } from '../../utils/helpers';
import FieldTag from '../FieldTag';

import Pitch from './Pitch/Pitch';

import './styles.scss';

interface ColumnProps {
  name: string;
  items: IPitch[];
  issueId: string;
}

const getStatusValue = (index: number): string => {
  switch (index) {
    case 0:
      return issueStatusEnum.MAYBE_IN;
    case 1:
      return issueStatusEnum.DEFINITELY_IN;
    case 2:
      return issueStatusEnum.IN_EDITS;
    case 3:
      return issueStatusEnum.READY_TO_PUBLISH;
    case 4:
      return issueStatusEnum.PUSH;
    default:
      return '';
  }
};

const onDragEnd = (
  result: DropResult,
  columns: ColumnProps[],
  setColumns: Dispatch<SetStateAction<ColumnProps[]>>,
): void => {
  if (!result.destination) {
    return;
  }

  const { source, destination } = result;

  const sourceColumnId = parseInt(source.droppableId);
  const targetColumnId = parseInt(destination.droppableId);

  const sourceColumn = columns[sourceColumnId];
  const targetColumn = columns[targetColumnId];

  const [pitch] = sourceColumn.items.splice(source.index, 1);
  targetColumn.items.splice(destination.index, 0, pitch);

  const newStatus = getStatusValue(targetColumnId);

  if (sourceColumnId !== targetColumnId) {
    updateIssueStatus(pitch._id, targetColumn.issueId, newStatus);
  }

  setColumns([...columns]);
};

const Kanban = (): ReactElement => {
  const [columns, setColumns] = useState<ColumnProps[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const res = await getNearestIssue();

      if (!isError(res)) {
        const issueId = res.data.result._id;
        const pitchRes = await getPitchBuckets(issueId);
        if (!isError(pitchRes)) {
          const pitchBuckets = pitchRes.data.result;

          const newColumns: ColumnProps[] = pitchBuckets.map((bucket) => ({
            name: titleCase(bucket.status.split('_').join(' ')),
            items: bucket.pitches,
            issueId: issueId,
          }));

          setColumns(newColumns);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <Segment className="kanban-wrapper">
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {columns.map((column, index) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            key={index}
          >
            <div className="kanban-header">
              <FieldTag size="small" key={index} content={column.name} />
              <p className="num-pitches">
                {column.items.length}{' '}
                {column.items.length === 1 ? 'pitch' : 'pitches'}
              </p>
            </div>
            <div style={{ margin: 8 }}>
              <Droppable droppableId={`${index}`} key={index}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`kanban-column ${
                      snapshot.isDraggingOver && 'dragging'
                    }`}
                  >
                    {column.items.map((item: IPitch, index: number) => (
                      <Draggable
                        key={item._id}
                        draggableId={item._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                          >
                            <Pitch
                              className={`${snapshot.isDragging && 'dragging'}`}
                              pitch={item}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </DragDropContext>
    </Segment>
  );
};

export default Kanban;
