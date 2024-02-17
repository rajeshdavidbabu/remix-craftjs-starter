import { useEditor, useNode } from '@craftjs/core';
import { Component, ReactNode, useEffect, useState } from 'react';
import Select, { MultiValue, components, createFilter } from 'react-select';
import { suggestions } from '~/lib/tw-classes';
import {
  Option,
  SelectValue,
} from 'react-tailwindcss-select/dist/components/type';
import { FixedSizeList as List } from 'react-window';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import { Input } from './ui/input';

const selectOptions = suggestions.map((value) => ({ label: value, value }));

export const SettingsControl = () => {
  const { query, actions } = useEditor();
  const {
    id,
    classNames,
    deletable,
    text,
    actions: { setProp },
  } = useNode((node) => ({
    classNames: node.data.props['className'] as string,
    text: node.data.props['children'] as string,
    deletable: query.node(node.id).isDeletable(),
  }));

  const tailwindcssArr = classNames
    ? classNames.split(' ').filter(Boolean)
    : [];

  const initialOptions = tailwindcssArr.map((value) => ({
    label: value,
    value,
  }));

  useEffect(() => {
    const tailwindcssArr = classNames
      ? classNames.split(' ').filter(Boolean)
      : [];

    const newOptions = tailwindcssArr.map((value) => ({
      label: value,
      value,
    }));

    setValue(newOptions);
  }, [classNames]);

  const [value, setValue] = useState<MultiValue<Option>>(initialOptions);

  const height = 35;

  interface MenuListProps {
    options: any[];
    children: any[];
    maxHeight: number;
    getValue: () => any[];
  }

  class MenuList extends Component<MenuListProps> {
    render() {
      const { options, children, maxHeight, getValue } = this.props;
      const [value] = getValue();
      const initialOffset = options.indexOf(value) * height;

      return (
        <List
          width={'100%'} // Replace with the desired width value
          height={maxHeight}
          itemCount={children.length}
          itemSize={height}
          initialScrollOffset={initialOffset}
        >
          {({ index, style }) => <div style={style}>{children[index]}</div>}
        </List>
      );
    }
  }

  const CustomOption = ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    innerProps: any;
  }) => {
    // Remove the niceties for mouseover and mousemove to optimize for large lists
    // eslint-disable-next-line no-unused-vars
    const { onMouseMove, onMouseOver, ...rest } = props.innerProps;
    const newProps = { ...props, innerProps: rest };
    return (
      <components.Option {...newProps}>
        <div className="text-xs">{children}</div>
      </components.Option>
    );
  };

  return (
    <div className="p-4">
      {deletable ? (
        <Button
          variant={'destructive'}
          className="cursor-pointer mb-4 w-full"
          onClick={(event) => {
            event.stopPropagation();
            if (parent) {
              actions.delete(id);
            }
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      ) : null}
      {typeof text === 'string' ? (
        <Input
          type="text"
          value={text}
          className="mb-4"
          onChange={(e) =>
            setProp(
              (props: { children: ReactNode }) =>
                (props.children = e.target.value.replace(/<\/?[^>]+(>|$)/g, ''))
            )
          }
        />
      ) : null}
      <Select
        options={selectOptions}
        isSearchable
        isClearable={false}
        components={{ MenuList, Option: CustomOption }}
        isMulti
        placeholder={'Add new class'}
        value={value}
        filterOption={createFilter({ ignoreAccents: false })}
        onChange={(option) => {
          if (option && Array.isArray(option)) {
            const classNames = option.map((item) => item.value).join(' ');
            setProp((props: { className: string }) => {
              console.log('Setting props ', props.className);
              props.className = classNames;
            });
          }

          if (!option) {
            setProp((props: { className: string }) => (props.className = ''));
          }

          setValue(option);
        }}
      />
    </div>
  );
};
