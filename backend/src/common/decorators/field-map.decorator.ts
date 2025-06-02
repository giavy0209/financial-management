import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  Kind,
  SelectionNode,
} from 'graphql';
import { FieldNode } from 'graphql';

export const getFieldNode = (
  info: Pick<GraphQLResolveInfo, 'fieldNodes' | 'fragments'>,
  path: string | string[] = [],
): FieldNode | undefined => {
  const { fieldNodes, fragments } = info;
  const fields = Array.isArray(path) ? [...path] : path.split('.');

  let selectionNodes: SelectionNode[] = [...fieldNodes];
  while (selectionNodes.length) {
    const currentNodes = [...selectionNodes];
    selectionNodes = [];

    const field = fields[0];

    let found = false;
    let fragmentFound = false;
    for (const selectionNode of currentNodes) {
      if (selectionNode.kind === Kind.FIELD) {
        if (selectionNode.name.value === field) {
          if (!found) {
            found = true;
            fields.shift();
          }
          if (!fields.length) {
            return selectionNode;
          }
          if (selectionNode.selectionSet) {
            selectionNodes = [
              ...selectionNodes,
              ...selectionNode.selectionSet.selections,
            ];
          }
        }
      } else if (selectionNode.kind === Kind.FRAGMENT_SPREAD) {
        fragmentFound = true;
        const fragment = fragments[selectionNode.name.value];
        selectionNodes = [
          ...selectionNodes,
          ...fragment.selectionSet.selections,
        ];
      } else {
        fragmentFound = true;
        selectionNodes = [
          ...selectionNodes,
          ...selectionNode.selectionSet.selections,
        ];
      }
    }

    if (!found && !fragmentFound) {
      return;
    }
  }
};

export interface FragmentDict {
  [key: string]: FragmentDefinitionNode;
}
export const resolveFieldMap = (
  info: Pick<GraphQLResolveInfo, 'fieldNodes' | 'fragments'>,
  parent: string | string[] = [],
) => {
  const { fieldNodes, fragments } = info;
  const parents = Array.isArray(parent) ? [...parent] : parent.split('.');

  if (parents.length) {
    const fieldNode = getFieldNode(info, parents);
    return resolveFieldMapRecursively(
      fieldNode?.selectionSet ? [...fieldNode.selectionSet.selections] : [],
      fragments,
    );
  }

  return resolveFieldMapRecursively([...fieldNodes], fragments);
};

const resolveFieldMapRecursively = (
  selectionNodes: SelectionNode[],
  fragments: FragmentDict,
  fieldMap: FieldMap = {},
) => {
  for (const selectionNode of selectionNodes) {
    if (selectionNode.kind === Kind.FIELD) {
      if (selectionNode.selectionSet) {
        fieldMap[selectionNode.name.value] = resolveFieldMapRecursively(
          [...selectionNode.selectionSet.selections],
          fragments,
        );
      } else {
        fieldMap[selectionNode.name.value] = {};
      }
    } else if (selectionNode.kind === Kind.FRAGMENT_SPREAD) {
      const fragment = fragments[selectionNode.name.value];
      fieldMap = resolveFieldMapRecursively(
        [...fragment.selectionSet.selections],
        fragments,
        fieldMap,
      );
    } else {
      fieldMap = resolveFieldMapRecursively(
        [...selectionNode.selectionSet.selections],
        fragments,
        fieldMap,
      );
    }
  }

  return fieldMap;
};

export interface FieldMap {
  [key: string]: FieldMap;
}

export interface MapSelect {
  [k: string]: true | { select: MapSelect };
}

function mapFieldsToSelect(fields: FieldMap) {
  const mapSelect: MapSelect = {};
  Object.keys(fields).forEach((field) => {
    if (field === '__typename') {
      return;
    }
    if (Object.keys(fields[field]).length === 0) {
      mapSelect[field] = true;
    } else {
      mapSelect[field] = { select: mapFieldsToSelect(fields[field]) };
    }
  });
  return mapSelect;
}
export const FieldMap = (parent: string | string[] = []) => {
  return createParamDecorator<
    {
      parent: string | string[];
    },
    MapSelect
  >(({ parent }, context) => {
    const ctx = GqlExecutionContext.create(context);
    const info = ctx.getInfo() as GraphQLResolveInfo;
    return mapFieldsToSelect(resolveFieldMap(info, parent));
  })({ parent });
};
