import {
	TLUiActionsContextType,
	TLUiMenuGroup,
	TLUiOverrides,
	TLUiToolsContextType,
	Tldraw,
	menuItem,
} from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import jsonSnapshot from './snapshot.json'

// There's a guide at the bottom of this file!

// [1]
const overrides: TLUiOverrides = {
	//[a]
	actions(_editor, actions): TLUiActionsContextType {
		actions['copy-as-png'].kbd = '$1'
		actions['toggle-grid'].kbd = 'x'
		return actions
	},
	//[b]
	tools(_editor, tools): TLUiToolsContextType {
		tools['draw'].kbd = 'p'
		return tools
	},
	//[c]
	keyboardShortcutsMenu(_editor, shortcutsMenu, { actions }) {
		const editGroup = shortcutsMenu.find(
			(group) => group.id === 'shortcuts-dialog.edit'
		) as TLUiMenuGroup

		editGroup.children.push(menuItem(actions['copy-as-png']))
		return shortcutsMenu
	},
}

// [2]
export default function KeyboardShortcuts() {
	return (
		<div className="tldraw__editor">
			<Tldraw persistenceKey="tldraw_kbd_shortcuts" overrides={overrides} snapshot={jsonSnapshot} />
		</div>
	)
}

/* 
This example shows how you can replace tldraw's default keyboard shortcuts with your own,
or add a shortcut for an action that doesn't have one. In this case we are overriding the 
toggle grid and draw tool shortcuts, and creating a shortcut for copy as png. An override
of an existing shortcut will automatically update the keyboard shortcuts dialog. However,
adding a new shortcut won't, we need to add it to the keyboard shortcuts dialog ourselves.

[1]
We start by defining our overrides, this is an object with functions that we can use to 
change the ui. We'll be using the actions [a], tools [b] and keyboardShortcutsMenu [c] 
overrides.

[a] actions
	There are two actions we're modifying here, copy-as-png and toggle-grid. copy-as-png
	doesn't have an existing shortcut, so we'll add it to the shortcuts menu later [c].

[b] tools
	We're overriding the draw tool's shortcut to 'p', because we want to rename it to the
	pen tool.

[c] keyboardShortcutsMenu
	This function takes 3 arguments, the editor instance (which we don't need), the menu
	schema, and the ui context. The shortcutsMenu is an array, so we'll need to use the 
	find method to return the edit section and add our new menu item to it. menuItem() is
	a helper function that creates a menu item for us, we just need to pass it an action. 
	We'll use the copy-as-png action that we modified in [a], we can grab it from the ui
	context's actions object.

[2]
Finally, we pass our overrides object into the Tldraw component's overrides prop. Now when
the component mounts, our overrides will be applied. If you open the keyboard shortcuts 
dialog, you'll see the changes we made.
*/
